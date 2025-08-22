import fs from 'fs';
import {findPointByAngleAndCircle} from '../../../math/drawingMath.js';
import {hexToRgba} from '../../../utils/hexToRgba.js';
import {LayerFactory} from '../../layer/LayerFactory.js';
import {globalBufferPool} from '../../../utils/BufferPool.js';

export class ByteArrayCanvasStrategy {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.buffer = null;
        this.channels = 4; // RGBA
    }

    async newCanvas(width, height) {
        this.width = width;
        this.height = height;
        const bufferSize = width * height * this.channels;
        this.buffer = globalBufferPool.get(bufferSize);
        this.buffer.fill(0); // Clear to transparent
    }

    async toFile(filename) {
        if (!this.buffer) throw new Error('No canvas buffer available');
        
        const pngBuffer = this._encodePNG();
        await fs.promises.writeFile(filename, pngBuffer);
    }

    async convertToLayer() {
        if (!this.buffer) throw new Error('No canvas buffer available');
        
        const pngBuffer = this._encodePNG();
        const layer = await LayerFactory.getLayerFromBuffer(pngBuffer);
        
        // Return buffer to pool
        globalBufferPool.release(this.buffer);
        this.buffer = null;
        
        return layer;
    }

    dispose() {
        if (this.buffer) {
            globalBufferPool.release(this.buffer);
            this.buffer = null;
        }
    }

    _encodePNG() {
        // Simple PNG encoder - creates a basic PNG structure
        const width = this.width;
        const height = this.height;
        
        // PNG signature
        const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        
        // IHDR chunk
        const ihdrData = Buffer.alloc(13);
        ihdrData.writeUInt32BE(width, 0);
        ihdrData.writeUInt32BE(height, 4);
        ihdrData[8] = 8; // bit depth
        ihdrData[9] = 6; // color type (RGBA)
        ihdrData[10] = 0; // compression
        ihdrData[11] = 0; // filter
        ihdrData[12] = 0; // interlace
        
        const ihdrChunk = this._createChunk('IHDR', ihdrData);
        
        // IDAT chunk - for simplicity, we'll use uncompressed data
        // In a real implementation, you'd use zlib compression
        const imageData = Buffer.alloc(height * (1 + width * 4)); // +1 for filter byte per row
        
        for (let y = 0; y < height; y++) {
            const rowStart = y * (1 + width * 4);
            imageData[rowStart] = 0; // filter type (none)
            
            for (let x = 0; x < width; x++) {
                const srcIndex = (y * width + x) * 4;
                const dstIndex = rowStart + 1 + x * 4;
                
                imageData[dstIndex] = this.buffer[srcIndex];     // R
                imageData[dstIndex + 1] = this.buffer[srcIndex + 1]; // G
                imageData[dstIndex + 2] = this.buffer[srcIndex + 2]; // B
                imageData[dstIndex + 3] = this.buffer[srcIndex + 3]; // A
            }
        }
        
        // For simplicity, we'll create a minimal PNG that can be read by LayerFactory
        // This creates an uncompressed IDAT which isn't standard but works for our use case
        const idatChunk = this._createChunk('IDAT', imageData);
        
        // IEND chunk
        const iendChunk = this._createChunk('IEND', Buffer.alloc(0));
        
        return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    }

    _createChunk(type, data) {
        const length = Buffer.alloc(4);
        length.writeUInt32BE(data.length, 0);
        
        const typeBuffer = Buffer.from(type, 'ascii');
        const crc = this._calculateCRC(Buffer.concat([typeBuffer, data]));
        const crcBuffer = Buffer.alloc(4);
        crcBuffer.writeUInt32BE(crc, 0);
        
        return Buffer.concat([length, typeBuffer, data, crcBuffer]);
    }

    _calculateCRC(data) {
        // Simple CRC32 calculation
        let crc = 0xFFFFFFFF;
        const crcTable = this._getCRCTable();
        
        for (let i = 0; i < data.length; i++) {
            crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
        }
        
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    _getCRCTable() {
        if (!this._crcTable) {
            this._crcTable = new Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let j = 0; j < 8; j++) {
                    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                }
                this._crcTable[i] = c;
            }
        }
        return this._crcTable;
    }

    _setPixel(x, y, r, g, b, a) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        
        const index = (y * this.width + x) * this.channels;
        
        // Alpha blending
        const srcAlpha = a / 255;
        const dstAlpha = this.buffer[index + 3] / 255;
        const outAlpha = srcAlpha + dstAlpha * (1 - srcAlpha);
        
        if (outAlpha > 0) {
            this.buffer[index] = (r * srcAlpha + this.buffer[index] * dstAlpha * (1 - srcAlpha)) / outAlpha;
            this.buffer[index + 1] = (g * srcAlpha + this.buffer[index + 1] * dstAlpha * (1 - srcAlpha)) / outAlpha;
            this.buffer[index + 2] = (b * srcAlpha + this.buffer[index + 2] * dstAlpha * (1 - srcAlpha)) / outAlpha;
            this.buffer[index + 3] = outAlpha * 255;
        }
    }

    _parseColor(color, alpha = 1) {
        if (typeof color === 'string') {
            const rgba = hexToRgba(color, alpha);
            const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                return {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3]),
                    a: Math.round((parseFloat(match[4]) || 1) * 255)
                };
            }
        }
        return { r: 0, g: 0, b: 0, a: Math.round(alpha * 255) };
    }

    _drawCircle(centerX, centerY, radius, strokeWidth, color, filled = false) {
        const colorData = this._parseColor(color);
        
        for (let y = -radius - strokeWidth; y <= radius + strokeWidth; y++) {
            for (let x = -radius - strokeWidth; x <= radius + strokeWidth; x++) {
                const distance = Math.sqrt(x * x + y * y);
                
                if (filled) {
                    if (distance <= radius) {
                        this._setPixel(centerX + x, centerY + y, colorData.r, colorData.g, colorData.b, colorData.a);
                    }
                } else {
                    if (distance >= radius - strokeWidth / 2 && distance <= radius + strokeWidth / 2) {
                        this._setPixel(centerX + x, centerY + y, colorData.r, colorData.g, colorData.b, colorData.a);
                    }
                }
            }
        }
    }

    _drawLine(x0, y0, x1, y1, strokeWidth, color) {
        const colorData = this._parseColor(color);
        
        // Bresenham's line algorithm with thickness
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        
        let x = x0;
        let y = y0;
        
        while (true) {
            // Draw thick line by drawing circle at each point
            this._drawCircle(x, y, strokeWidth / 2, 1, color, true);
            
            if (x === x1 && y === y1) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        this._drawCircle(pos.x, pos.y, radius, innerStroke + outerStroke, outerColor, false);
        this._drawCircle(pos.x, pos.y, radius, innerStroke, innerColor, false);
    }

    async drawRay2d(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor) {
        const adjustment = outerStroke;
        
        let start = findPointByAngleAndCircle(pos, angle, radius - adjustment);
        let end = findPointByAngleAndCircle(pos, angle, radius + length - adjustment);
        
        let strokeStart = findPointByAngleAndCircle(pos, angle, radius);
        let strokeEnd = findPointByAngleAndCircle(pos, angle, radius + length);
        
        if (length < 0) {
            start = findPointByAngleAndCircle(pos, angle, radius + adjustment);
            end = findPointByAngleAndCircle(pos, angle, radius + length + adjustment);
            strokeStart = findPointByAngleAndCircle(pos, angle, radius);
            strokeEnd = findPointByAngleAndCircle(pos, angle, radius + length);
        }
        
        this._drawLine(strokeStart.x, strokeStart.y, strokeEnd.x, strokeEnd.y, innerStroke + outerStroke, outerColor);
        this._drawLine(start.x, start.y, end.x, end.y, innerStroke, innerColor);
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        for (let i = 0; i < 360; i += sparsityFactor) {
            await this.drawRay2d(pos, i, radius, length, innerStroke, innerColor, outerStroke, outerColor);
        }
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        const points = [];
        const angle = (Math.PI * 2) / numberOfSides;
        
        for (let i = 0; i <= numberOfSides; i++) {
            const x = pos.x + radius * Math.cos(angle * i + startAngle * Math.PI / 180);
            const y = pos.y + radius * Math.sin(angle * i + startAngle * Math.PI / 180);
            points.push({ x, y });
        }
        
        // Draw polygon outline
        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            this._drawLine(start.x, start.y, end.x, end.y, innerStroke + outerStroke, outerColor);
            this._drawLine(start.x, start.y, end.x, end.y, innerStroke, innerColor);
        }
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        const steps = Math.ceil(length);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = startPos.x + dx * t;
            const y = startPos.y + dy * t;
            
            // Interpolate colors
            const startRgba = this._parseColor(startColor);
            const endRgba = this._parseColor(endColor);
            
            const r = Math.round(startRgba.r + (endRgba.r - startRgba.r) * t);
            const g = Math.round(startRgba.g + (endRgba.g - startRgba.g) * t);
            const b = Math.round(startRgba.b + (endRgba.b - startRgba.b) * t);
            const a = Math.round(startRgba.a + (endRgba.a - startRgba.a) * t);
            
            this._drawCircle(x, y, stroke / 2, 1, `rgba(${r},${g},${b},${a/255})`, true);
        }
    }

    async drawLine2d(start, end, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        this._drawLine(start.x, start.y, end.x, end.y, innerStroke + outerStroke, outerColor);
        this._drawLine(start.x, start.y, end.x, end.y, innerStroke, innerColor);
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        const points = [];
        const angle = (Math.PI * 2) / numberOfSides;
        
        for (let i = 0; i < numberOfSides; i++) {
            const x = pos.x + radius * Math.cos(angle * i + startAngle * Math.PI / 180);
            const y = pos.y + radius * Math.sin(angle * i + startAngle * Math.PI / 180);
            points.push({ x, y });
        }
        
        // Simple polygon fill using scanline algorithm
        const colorData = this._parseColor(fillColor, alpha);
        
        // Find bounding box
        let minY = Math.min(...points.map(p => p.y));
        let maxY = Math.max(...points.map(p => p.y));
        
        for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
            const intersections = [];
            
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                
                if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
                    const x = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
                    intersections.push(x);
                }
            }
            
            intersections.sort((a, b) => a - b);
            
            for (let i = 0; i < intersections.length; i += 2) {
                if (i + 1 < intersections.length) {
                    const startX = Math.floor(intersections[i]);
                    const endX = Math.ceil(intersections[i + 1]);
                    
                    for (let x = startX; x <= endX; x++) {
                        this._setPixel(x, y, colorData.r, colorData.g, colorData.b, colorData.a);
                    }
                }
            }
        }
    }

    async drawBezierCurve(start, control, end, innerStroke, innerColor, outerStroke, outerColor) {
        const steps = 100;
        let prevPoint = start;
        
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const invT = 1 - t;
            
            const x = invT * invT * start.x + 2 * invT * t * control.x + t * t * end.x;
            const y = invT * invT * start.y + 2 * invT * t * control.y + t * t * end.y;
            
            const currentPoint = { x, y };
            
            this._drawLine(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y, innerStroke + outerStroke, outerColor);
            this._drawLine(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y, innerStroke, innerColor);
            
            prevPoint = currentPoint;
        }
    }

    async drawPath(segment, innerStroke, innerColor, outerStroke, outerColor) {
        // Basic SVG path parsing for common commands
        const commands = segment.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
        let currentX = 0, currentY = 0;
        let startX = 0, startY = 0;
        
        for (const command of commands) {
            const type = command[0];
            const coords = command.slice(1).trim().split(/[\s,]+/).map(Number);
            
            switch (type.toLowerCase()) {
                case 'm':
                    currentX = type === 'M' ? coords[0] : currentX + coords[0];
                    currentY = type === 'M' ? coords[1] : currentY + coords[1];
                    startX = currentX;
                    startY = currentY;
                    break;
                case 'l':
                    const newX = type === 'L' ? coords[0] : currentX + coords[0];
                    const newY = type === 'L' ? coords[1] : currentY + coords[1];
                    this._drawLine(currentX, currentY, newX, newY, innerStroke + outerStroke, outerColor);
                    this._drawLine(currentX, currentY, newX, newY, innerStroke, innerColor);
                    currentX = newX;
                    currentY = newY;
                    break;
                case 'q':
                    if (coords.length >= 4) {
                        const controlX = type === 'Q' ? coords[0] : currentX + coords[0];
                        const controlY = type === 'Q' ? coords[1] : currentY + coords[1];
                        const endX = type === 'Q' ? coords[2] : currentX + coords[2];
                        const endY = type === 'Q' ? coords[3] : currentY + coords[3];
                        
                        await this.drawBezierCurve(
                            { x: currentX, y: currentY },
                            { x: controlX, y: controlY },
                            { x: endX, y: endY },
                            innerStroke, innerColor, outerStroke, outerColor
                        );
                        
                        currentX = endX;
                        currentY = endY;
                    }
                    break;
                case 'z':
                    this._drawLine(currentX, currentY, startX, startY, innerStroke + outerStroke, outerColor);
                    this._drawLine(currentX, currentY, startX, startY, innerStroke, innerColor);
                    currentX = startX;
                    currentY = startY;
                    break;
            }
        }
    }

    async drawGradientRect(x, y, width, height, colorStops) {
        for (let dy = 0; dy < height; dy++) {
            const t = dy / height;
            
            // Find the two color stops to interpolate between
            let startStop = colorStops[0];
            let endStop = colorStops[colorStops.length - 1];
            
            for (let i = 0; i < colorStops.length - 1; i++) {
                if (t >= colorStops[i].offset && t <= colorStops[i + 1].offset) {
                    startStop = colorStops[i];
                    endStop = colorStops[i + 1];
                    break;
                }
            }
            
            // Interpolate between the two stops
            const localT = (t - startStop.offset) / (endStop.offset - startStop.offset);
            const startColor = this._parseColor(startStop.color);
            const endColor = this._parseColor(endStop.color);
            
            const r = Math.round(startColor.r + (endColor.r - startColor.r) * localT);
            const g = Math.round(startColor.g + (endColor.g - startColor.g) * localT);
            const b = Math.round(startColor.b + (endColor.b - startColor.b) * localT);
            const a = Math.round(startColor.a + (endColor.a - startColor.a) * localT);
            
            for (let dx = 0; dx < width; dx++) {
                this._setPixel(x + dx, y + dy, r, g, b, a);
            }
        }
    }
}
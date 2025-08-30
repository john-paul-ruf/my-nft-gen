import fs from 'fs';
import {Readable} from 'stream';
import {pipeline} from 'node:stream/promises';
import {createWriteStream} from 'fs';
import {mapNumberToRange} from '../../../math/mapNumberToRange.js';
import {randomId} from '../../../math/random.js';
import {globalBufferPool} from '../../../utils/BufferPool.js';
import BlendMode from '../BlendMode.js';

export class ByteArrayLayerStrategy {
    constructor({
                    finalImageSize = {
                        width: 0,
                        height: 0,
                        longestSide: 0,
                        shortestSide: 0,
                    },
                    workingDirectory = null,
                }) {
        this.buffer = null;
        this.width = 0;
        this.height = 0;
        this.channels = 4; // RGBA
        this.finalImageSize = finalImageSize;
        this.workingDirectory = workingDirectory;
    }

    async newLayer(height, width, backgroundColor) {
        this.width = width;
        this.height = height;
        const bufferSize = width * height * this.channels;
        this.buffer = globalBufferPool.get(bufferSize);
        
        // Parse background color and fill buffer
        const color = this._parseColor(backgroundColor);
        for (let i = 0; i < bufferSize; i += 4) {
            this.buffer[i] = color.r;
            this.buffer[i + 1] = color.g;
            this.buffer[i + 2] = color.b;
            this.buffer[i + 3] = color.a;
        }
    }

    async fromFile(filename) {
        const fileBuffer = await fs.promises.readFile(filename);
        await this.fromBuffer(fileBuffer);
    }

    async fromBuffer(pngBuffer) {
        const decoded = this._decodePNG(pngBuffer);
        this.width = decoded.width;
        this.height = decoded.height;
        
        if (this.buffer) {
            globalBufferPool.release(this.buffer);
        }
        
        this.buffer = decoded.data;
    }

    async toBuffer() {
        return this._encodePNG();
    }

    async toFile(filename) {
        const pngBuffer = this._encodePNG();
        const readableStream = Readable.from(pngBuffer);
        const writableStream = createWriteStream(filename);
        await pipeline(readableStream, writableStream);
    }

    async compositeLayerOver(layer, withoutResize = false, blendMode = BlendMode.OVER) {
        const {finalImageSize} = this;
        
        const currentInfo = await this.getInfo();
        const layerInfo = await layer.getInfo();

        if (!withoutResize) {
            if (currentInfo.height > finalImageSize.height || currentInfo.width > finalImageSize.width) {
                await this.resize(finalImageSize.height, finalImageSize.width, 'contain');
            }

            if (layerInfo.height > finalImageSize.height || layerInfo.width > finalImageSize.width) {
                await layer.resize(finalImageSize.height, finalImageSize.width, 'contain');
            }
        }

        const layerBuffer = await layer.toBuffer();
        const layerDecoded = this._decodePNG(layerBuffer);
        
        // Composite the layer over this layer
        this._compositeBuffers(layerDecoded.data, layerDecoded.width, layerDecoded.height, 0, 0, blendMode);
    }

    async compositeLayerOverAtPoint(layer, top, left, blendMode = BlendMode.OVER) {
        const layerBuffer = await layer.toBuffer();
        const layerDecoded = this._decodePNG(layerBuffer);
        
        this._compositeBuffers(layerDecoded.data, layerDecoded.width, layerDecoded.height, Math.floor(left), Math.floor(top), blendMode);
    }

    async adjustLayerOpacity(opacity) {
        const newOpacity = Math.round(mapNumberToRange(opacity, 0, 1, 0, 255));
        
        for (let i = 3; i < this.buffer.length; i += 4) {
            this.buffer[i] = Math.round((this.buffer[i] / 255) * newOpacity);
        }
    }

    async blur(byPixels) {
        if (byPixels <= 0) return;
        
        // Simple box blur implementation
        const radius = Math.max(1, Math.floor(byPixels));
        const tempBuffer = Buffer.from(this.buffer);
        
        // Horizontal blur
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                for (let c = 0; c < this.channels; c++) {
                    let sum = 0;
                    let count = 0;
                    
                    for (let dx = -radius; dx <= radius; dx++) {
                        const sx = x + dx;
                        if (sx >= 0 && sx < this.width) {
                            const index = (y * this.width + sx) * this.channels + c;
                            sum += tempBuffer[index];
                            count++;
                        }
                    }
                    
                    const index = (y * this.width + x) * this.channels + c;
                    this.buffer[index] = Math.round(sum / count);
                }
            }
        }
        
        // Vertical blur
        tempBuffer.set(this.buffer);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                for (let c = 0; c < this.channels; c++) {
                    let sum = 0;
                    let count = 0;
                    
                    for (let dy = -radius; dy <= radius; dy++) {
                        const sy = y + dy;
                        if (sy >= 0 && sy < this.height) {
                            const index = (sy * this.width + x) * this.channels + c;
                            sum += tempBuffer[index];
                            count++;
                        }
                    }
                    
                    const index = (y * this.width + x) * this.channels + c;
                    this.buffer[index] = Math.round(sum / count);
                }
            }
        }
    }

    async rotate(angle) {
        const radians = (angle * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        const newBuffer = globalBufferPool.get(this.width * this.height * this.channels);
        newBuffer.fill(0); // Transparent background
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Rotate coordinates
                const dx = x - centerX;
                const dy = y - centerY;
                const srcX = Math.round(centerX + dx * cos + dy * sin);
                const srcY = Math.round(centerY - dx * sin + dy * cos);
                
                if (srcX >= 0 && srcX < this.width && srcY >= 0 && srcY < this.height) {
                    const srcIndex = (srcY * this.width + srcX) * this.channels;
                    const dstIndex = (y * this.width + x) * this.channels;
                    
                    for (let c = 0; c < this.channels; c++) {
                        newBuffer[dstIndex + c] = this.buffer[srcIndex + c];
                    }
                }
            }
        }
        
        globalBufferPool.release(this.buffer);
        this.buffer = newBuffer;
    }

    async resize(height, width, fitType) {
        const scaleX = width / this.width;
        const scaleY = height / this.height;
        
        let finalScale, offsetX = 0, offsetY = 0;
        
        if (fitType === 'contain') {
            finalScale = Math.min(scaleX, scaleY);
            const newWidth = this.width * finalScale;
            const newHeight = this.height * finalScale;
            offsetX = (width - newWidth) / 2;
            offsetY = (height - newHeight) / 2;
        } else {
            finalScale = Math.max(scaleX, scaleY);
        }
        
        const newBuffer = globalBufferPool.get(width * height * this.channels);
        newBuffer.fill(0); // Transparent background
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcX = (x - offsetX) / finalScale;
                const srcY = (y - offsetY) / finalScale;
                
                if (srcX >= 0 && srcX < this.width && srcY >= 0 && srcY < this.height) {
                    // Nearest neighbor interpolation
                    const sx = Math.round(srcX);
                    const sy = Math.round(srcY);
                    
                    if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height) {
                        const srcIndex = (sy * this.width + sx) * this.channels;
                        const dstIndex = (y * width + x) * this.channels;
                        
                        for (let c = 0; c < this.channels; c++) {
                            newBuffer[dstIndex + c] = this.buffer[srcIndex + c];
                        }
                    }
                }
            }
        }
        
        globalBufferPool.release(this.buffer);
        this.buffer = newBuffer;
        this.width = width;
        this.height = height;
    }

    async crop(left, top, width, height) {
        const newBuffer = globalBufferPool.get(width * height * this.channels);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcX = left + x;
                const srcY = top + y;
                
                if (srcX >= 0 && srcX < this.width && srcY >= 0 && srcY < this.height) {
                    const srcIndex = (srcY * this.width + srcX) * this.channels;
                    const dstIndex = (y * width + x) * this.channels;
                    
                    for (let c = 0; c < this.channels; c++) {
                        newBuffer[dstIndex + c] = this.buffer[srcIndex + c];
                    }
                }
            }
        }
        
        globalBufferPool.release(this.buffer);
        this.buffer = newBuffer;
        this.width = width;
        this.height = height;
    }

    async extend(top, bottom, left, right) {
        const newWidth = this.width + left + right;
        const newHeight = this.height + top + bottom;
        const newBuffer = globalBufferPool.get(newWidth * newHeight * this.channels);
        newBuffer.fill(0); // Transparent background
        
        // Copy existing image to new position
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const srcIndex = (y * this.width + x) * this.channels;
                const dstIndex = ((y + top) * newWidth + (x + left)) * this.channels;
                
                for (let c = 0; c < this.channels; c++) {
                    newBuffer[dstIndex + c] = this.buffer[srcIndex + c];
                }
            }
        }
        
        globalBufferPool.release(this.buffer);
        this.buffer = newBuffer;
        this.width = newWidth;
        this.height = newHeight;
    }

    async getInfo() {
        return {
            width: this.width,
            height: this.height,
            channels: this.channels,
            format: 'png'
        };
    }

    async modulate({brightness = 1, saturation = 1, contrast = 1}) {
        for (let i = 0; i < this.buffer.length; i += 4) {
            let r = this.buffer[i];
            let g = this.buffer[i + 1];
            let b = this.buffer[i + 2];
            
            // Apply brightness
            r = Math.min(255, Math.max(0, r * brightness));
            g = Math.min(255, Math.max(0, g * brightness));
            b = Math.min(255, Math.max(0, b * brightness));
            
            // Apply contrast
            r = Math.min(255, Math.max(0, ((r / 255 - 0.5) * contrast + 0.5) * 255));
            g = Math.min(255, Math.max(0, ((g / 255 - 0.5) * contrast + 0.5) * 255));
            b = Math.min(255, Math.max(0, ((b / 255 - 0.5) * contrast + 0.5) * 255));
            
            // Apply saturation (convert to HSL, modify S, convert back)
            if (saturation !== 1) {
                const {h, s, l} = this._rgbToHsl(r, g, b);
                const newS = Math.min(1, Math.max(0, s * saturation));
                const rgb = this._hslToRgb(h, newS, l);
                r = rgb.r;
                g = rgb.g;
                b = rgb.b;
            }
            
            this.buffer[i] = Math.round(r);
            this.buffer[i + 1] = Math.round(g);
            this.buffer[i + 2] = Math.round(b);
        }
        
        return await this.getInfo();
    }

    _parseColor(color) {
        if (typeof color === 'string') {
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
                return {r, g, b, a};
            }
        }
        if (typeof color === 'object' && color.r !== undefined) {
            return {
                r: color.r || 0,
                g: color.g || 0,
                b: color.b || 0,
                a: color.alpha !== undefined ? Math.round(color.alpha * 255) : 255
            };
        }
        return {r: 0, g: 0, b: 0, a: 0}; // Transparent default
    }

    _compositeBuffers(sourceBuffer, sourceWidth, sourceHeight, offsetX, offsetY, blendMode = BlendMode.OVER) {
        for (let y = 0; y < sourceHeight; y++) {
            for (let x = 0; x < sourceWidth; x++) {
                const dstX = x + offsetX;
                const dstY = y + offsetY;
                
                if (dstX >= 0 && dstX < this.width && dstY >= 0 && dstY < this.height) {
                    const srcIndex = (y * sourceWidth + x) * this.channels;
                    const dstIndex = (dstY * this.width + dstX) * this.channels;
                    
                    const srcR = sourceBuffer[srcIndex];
                    const srcG = sourceBuffer[srcIndex + 1];
                    const srcB = sourceBuffer[srcIndex + 2];
                    const srcA = sourceBuffer[srcIndex + 3];
                    
                    const dstR = this.buffer[dstIndex];
                    const dstG = this.buffer[dstIndex + 1];
                    const dstB = this.buffer[dstIndex + 2];
                    const dstA = this.buffer[dstIndex + 3];
                    
                    const result = this._blendPixels(srcR, srcG, srcB, srcA, dstR, dstG, dstB, dstA, blendMode);
                    
                    this.buffer[dstIndex] = result.r;
                    this.buffer[dstIndex + 1] = result.g;
                    this.buffer[dstIndex + 2] = result.b;
                    this.buffer[dstIndex + 3] = result.a;
                }
            }
        }
    }

    _blendPixels(srcR, srcG, srcB, srcA, dstR, dstG, dstB, dstA, blendMode) {
        const srcAlpha = srcA / 255;
        const dstAlpha = dstA / 255;
        
        let outR, outG, outB, outA;
        
        switch (blendMode) {
            case BlendMode.MULTIPLY:
                outR = (srcR * dstR) / 255;
                outG = (srcG * dstG) / 255;
                outB = (srcB * dstB) / 255;
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.SCREEN:
                outR = 255 - ((255 - srcR) * (255 - dstR)) / 255;
                outG = 255 - ((255 - srcG) * (255 - dstG)) / 255;
                outB = 255 - ((255 - srcB) * (255 - dstB)) / 255;
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.OVERLAY:
                outR = dstR < 128 ? (2 * srcR * dstR) / 255 : 255 - (2 * (255 - srcR) * (255 - dstR)) / 255;
                outG = dstG < 128 ? (2 * srcG * dstG) / 255 : 255 - (2 * (255 - srcG) * (255 - dstG)) / 255;
                outB = dstB < 128 ? (2 * srcB * dstB) / 255 : 255 - (2 * (255 - srcB) * (255 - dstB)) / 255;
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.DARKEN:
                outR = Math.min(srcR, dstR);
                outG = Math.min(srcG, dstG);
                outB = Math.min(srcB, dstB);
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.LIGHTEN:
                outR = Math.max(srcR, dstR);
                outG = Math.max(srcG, dstG);
                outB = Math.max(srcB, dstB);
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.COLOUR_DODGE:
            case BlendMode.COLOR_DODGE:
                outR = dstR === 255 ? 255 : Math.min(255, (srcR * 255) / (255 - dstR));
                outG = dstG === 255 ? 255 : Math.min(255, (srcG * 255) / (255 - dstG));
                outB = dstB === 255 ? 255 : Math.min(255, (srcB * 255) / (255 - dstB));
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.COLOUR_BURN:
            case BlendMode.COLOR_BURN:
                outR = srcR === 0 ? 0 : Math.max(0, 255 - ((255 - dstR) * 255) / srcR);
                outG = srcG === 0 ? 0 : Math.max(0, 255 - ((255 - dstG) * 255) / srcG);
                outB = srcB === 0 ? 0 : Math.max(0, 255 - ((255 - dstB) * 255) / srcB);
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.HARD_LIGHT:
                outR = srcR < 128 ? (2 * srcR * dstR) / 255 : 255 - (2 * (255 - srcR) * (255 - dstR)) / 255;
                outG = srcG < 128 ? (2 * srcG * dstG) / 255 : 255 - (2 * (255 - srcG) * (255 - dstG)) / 255;
                outB = srcB < 128 ? (2 * srcB * dstB) / 255 : 255 - (2 * (255 - srcB) * (255 - dstB)) / 255;
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.SOFT_LIGHT:
                const softLightBlend = (src, dst) => {
                    const s = src / 255;
                    const d = dst / 255;
                    if (s <= 0.5) {
                        return (d - (1 - 2 * s) * d * (1 - d)) * 255;
                    } else {
                        const g = d <= 0.25 ? ((16 * d - 12) * d + 4) * d : Math.sqrt(d);
                        return (d + (2 * s - 1) * (g - d)) * 255;
                    }
                };
                outR = softLightBlend(srcR, dstR);
                outG = softLightBlend(srcG, dstG);
                outB = softLightBlend(srcB, dstB);
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.DIFFERENCE:
                outR = Math.abs(srcR - dstR);
                outG = Math.abs(srcG - dstG);
                outB = Math.abs(srcB - dstB);
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.EXCLUSION:
                outR = srcR + dstR - (2 * srcR * dstR) / 255;
                outG = srcG + dstG - (2 * srcG * dstG) / 255;
                outB = srcB + dstB - (2 * srcB * dstB) / 255;
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.DEST_IN:
                outR = dstR;
                outG = dstG;
                outB = dstB;
                outA = dstAlpha * srcAlpha;
                break;
                
            case BlendMode.DEST_OUT:
                outR = dstR;
                outG = dstG;
                outB = dstB;
                outA = dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.DEST_OVER:
                outA = dstAlpha + srcAlpha * (1 - dstAlpha);
                if (outA > 0) {
                    outR = (dstR * dstAlpha + srcR * srcAlpha * (1 - dstAlpha)) / outA;
                    outG = (dstG * dstAlpha + srcG * srcAlpha * (1 - dstAlpha)) / outA;
                    outB = (dstB * dstAlpha + srcB * srcAlpha * (1 - dstAlpha)) / outA;
                } else {
                    outR = outG = outB = 0;
                }
                break;
                
            case BlendMode.DEST_ATOP:
                outR = srcR * (1 - dstAlpha) + dstR * dstAlpha;
                outG = srcG * (1 - dstAlpha) + dstG * dstAlpha;
                outB = srcB * (1 - dstAlpha) + dstB * dstAlpha;
                outA = srcAlpha;
                break;
                
            case BlendMode.XOR:
                outR = srcR * (1 - dstAlpha) + dstR * (1 - srcAlpha);
                outG = srcG * (1 - dstAlpha) + dstG * (1 - srcAlpha);
                outB = srcB * (1 - dstAlpha) + dstB * (1 - srcAlpha);
                outA = srcAlpha * (1 - dstAlpha) + dstAlpha * (1 - srcAlpha);
                break;
                
            case BlendMode.ADD:
                outR = Math.min(255, srcR + dstR);
                outG = Math.min(255, srcG + dstG);
                outB = Math.min(255, srcB + dstB);
                outA = Math.min(1, srcAlpha + dstAlpha);
                break;
                
            case BlendMode.SATURATE:
                outR = Math.min(255, srcR + dstR);
                outG = Math.min(255, srcG + dstG);
                outB = Math.min(255, srcB + dstB);
                outA = Math.max(srcAlpha, dstAlpha);
                break;
                
            case BlendMode.OVER:
            default:
                outA = srcAlpha + dstAlpha * (1 - srcAlpha);
                if (outA > 0) {
                    outR = (srcR * srcAlpha + dstR * dstAlpha * (1 - srcAlpha)) / outA;
                    outG = (srcG * srcAlpha + dstG * dstAlpha * (1 - srcAlpha)) / outA;
                    outB = (srcB * srcAlpha + dstB * dstAlpha * (1 - srcAlpha)) / outA;
                } else {
                    outR = outG = outB = 0;
                }
                break;
        }
        
        return {
            r: Math.round(Math.min(255, Math.max(0, outR))),
            g: Math.round(Math.min(255, Math.max(0, outG))),
            b: Math.round(Math.min(255, Math.max(0, outB))),
            a: Math.round(Math.min(255, Math.max(0, outA * 255)))
        };
    }

    _encodePNG() {
        // PNG signature
        const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        
        // IHDR chunk
        const ihdrData = Buffer.alloc(13);
        ihdrData.writeUInt32BE(this.width, 0);
        ihdrData.writeUInt32BE(this.height, 4);
        ihdrData[8] = 8; // bit depth
        ihdrData[9] = 6; // color type (RGBA)
        ihdrData[10] = 0; // compression
        ihdrData[11] = 0; // filter
        ihdrData[12] = 0; // interlace
        
        const ihdrChunk = this._createChunk('IHDR', ihdrData);
        
        // IDAT chunk with raw image data (simplified)
        const imageData = Buffer.alloc(this.height * (1 + this.width * 4));
        
        for (let y = 0; y < this.height; y++) {
            const rowStart = y * (1 + this.width * 4);
            imageData[rowStart] = 0; // filter type (none)
            
            for (let x = 0; x < this.width; x++) {
                const srcIndex = (y * this.width + x) * 4;
                const dstIndex = rowStart + 1 + x * 4;
                
                imageData[dstIndex] = this.buffer[srcIndex];
                imageData[dstIndex + 1] = this.buffer[srcIndex + 1];
                imageData[dstIndex + 2] = this.buffer[srcIndex + 2];
                imageData[dstIndex + 3] = this.buffer[srcIndex + 3];
            }
        }
        
        const idatChunk = this._createChunk('IDAT', imageData);
        const iendChunk = this._createChunk('IEND', Buffer.alloc(0));
        
        return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    }

    _decodePNG(pngBuffer) {
        // Simple PNG decoder for basic PNG files
        let offset = 8; // Skip PNG signature
        
        let width = 0, height = 0;
        let imageData = null;
        
        while (offset < pngBuffer.length) {
            const length = pngBuffer.readUInt32BE(offset);
            const type = pngBuffer.toString('ascii', offset + 4, offset + 8);
            const data = pngBuffer.subarray(offset + 8, offset + 8 + length);
            
            if (type === 'IHDR') {
                width = data.readUInt32BE(0);
                height = data.readUInt32BE(4);
            } else if (type === 'IDAT') {
                // For simplicity, assume uncompressed data
                const rowSize = 1 + width * 4;
                const buffer = globalBufferPool.get(width * height * 4);
                
                for (let y = 0; y < height; y++) {
                    const rowStart = y * rowSize + 1; // Skip filter byte
                    for (let x = 0; x < width; x++) {
                        const srcIndex = rowStart + x * 4;
                        const dstIndex = (y * width + x) * 4;
                        
                        if (srcIndex + 3 < data.length) {
                            buffer[dstIndex] = data[srcIndex];
                            buffer[dstIndex + 1] = data[srcIndex + 1];
                            buffer[dstIndex + 2] = data[srcIndex + 2];
                            buffer[dstIndex + 3] = data[srcIndex + 3];
                        }
                    }
                }
                imageData = buffer;
            }
            
            offset += 8 + length + 4; // length + type + data + crc
        }
        
        return { width, height, data: imageData };
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

    _rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {h, s, l};
    }

    _hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}
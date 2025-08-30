import fs from 'fs';
import {findPointByAngleAndCircle} from '../../../math/drawingMath.js';
import {LayerFactory} from '../../layer/LayerFactory.js';
import sharp from 'sharp';

export class SvgCanvasStrategy {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.elements = [];
        this.currentTransform = '';
        this._pathCache = new Map();
    }

    async newCanvas(width, height) {
        this.width = width;
        this.height = height;
        this.elements = [];
        // Create background rect
        this.elements.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="transparent"/>`);
    }

    async toFile(filename) {
        const svgContent = this._generateSVG();
        
        // Convert SVG to PNG using Sharp for final output
        const pngBuffer = await sharp(Buffer.from(svgContent))
            .png()
            .toBuffer();
            
        await fs.promises.writeFile(filename, pngBuffer);
    }

    async convertToLayer() {
        const svgContent = this._generateSVG();
        
        // Convert SVG to PNG buffer using Sharp
        const pngBuffer = await sharp(Buffer.from(svgContent))
            .png()
            .toBuffer();
        
        const layer = await LayerFactory.getLayerFromBuffer(pngBuffer);
        return layer;
    }

    dispose() {
        this.elements = [];
        this._pathCache.clear();
    }

    _generateSVG() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">
${this.elements.join('\n')}
</svg>`;
    }

    _colorToSvg(color, alpha = 1) {
        if (typeof color === 'string') {
            if (color.startsWith('#')) {
                if (alpha < 1) {
                    // Convert hex to rgba
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);
                    return `rgba(${r},${g},${b},${alpha})`;
                }
                return color;
            }
            return color;
        }
        return '#000000';
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        const outerRadius = radius + outerStroke / 2;
        const innerRadius = Math.max(0, radius - outerStroke / 2);
        
        // Draw outer ring
        if (outerStroke > 0) {
            this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${outerRadius}" 
                fill="none" stroke="${this._colorToSvg(outerColor, alpha)}" 
                stroke-width="${outerStroke}"/>`);
        }
        
        // Draw inner ring
        if (innerStroke > 0) {
            this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${Math.max(0, radius - innerStroke / 2)}" 
                fill="none" stroke="${this._colorToSvg(innerColor, alpha)}" 
                stroke-width="${innerStroke}"/>`);
        }
    }

    async drawRay2d(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor) {
        const start = findPointByAngleAndCircle(pos, angle, radius);
        const end = findPointByAngleAndCircle(pos, angle, radius + length);
        
        // Draw outer line
        if (outerStroke > 0) {
            this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" 
                stroke="${this._colorToSvg(outerColor)}" stroke-width="${outerStroke}" 
                stroke-linecap="round"/>`);
        }
        
        // Draw inner line
        if (innerStroke > 0) {
            this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" 
                stroke="${this._colorToSvg(innerColor)}" stroke-width="${innerStroke}" 
                stroke-linecap="round"/>`);
        }
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        const rays = [];
        for (let i = 0; i < 360; i += sparsityFactor) {
            const start = findPointByAngleAndCircle(pos, i, radius);
            const end = findPointByAngleAndCircle(pos, i, radius + length);
            rays.push(`M ${start.x} ${start.y} L ${end.x} ${end.y}`);
        }
        
        const pathData = rays.join(' ');
        
        // Draw outer rays
        if (outerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(outerColor)}" stroke-width="${outerStroke}" 
                stroke-linecap="round"/>`);
        }
        
        // Draw inner rays
        if (innerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(innerColor)}" stroke-width="${innerStroke}" 
                stroke-linecap="round"/>`);
        }
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        const points = [];
        const angle = 360 / numberOfSides;
        
        for (let i = 0; i <= numberOfSides; i++) {
            const currentAngle = (startAngle + angle * i) * Math.PI / 180;
            const x = pos.x + radius * Math.cos(currentAngle);
            const y = pos.y + radius * Math.sin(currentAngle);
            points.push(`${x},${y}`);
        }
        
        const pointsStr = points.join(' ');
        
        // Draw outer polygon
        if (outerStroke > 0) {
            this.elements.push(`<polygon points="${pointsStr}" fill="none" 
                stroke="${this._colorToSvg(outerColor, alpha)}" stroke-width="${outerStroke}" 
                stroke-linejoin="round"/>`);
        }
        
        // Draw inner polygon
        if (innerStroke > 0) {
            this.elements.push(`<polygon points="${pointsStr}" fill="none" 
                stroke="${this._colorToSvg(innerColor, alpha)}" stroke-width="${innerStroke}" 
                stroke-linejoin="round"/>`);
        }
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        // Create gradient definition
        const gradientId = `gradient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.elements.push(`<defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${this._colorToSvg(startColor)};stop-opacity:1"/>
                <stop offset="100%" style="stop-color:${this._colorToSvg(endColor)};stop-opacity:1"/>
            </linearGradient>
        </defs>`);
        
        this.elements.push(`<line x1="${startPos.x}" y1="${startPos.y}" x2="${endPos.x}" y2="${endPos.y}" 
            stroke="url(#${gradientId})" stroke-width="${stroke}" stroke-linecap="round"/>`);
    }

    async drawLine2d(start, end, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        // Draw outer line
        if (outerStroke > 0) {
            this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" 
                stroke="${this._colorToSvg(outerColor, alpha)}" stroke-width="${outerStroke}" 
                stroke-linecap="round"/>`);
        }
        
        // Draw inner line
        if (innerStroke > 0) {
            this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" 
                stroke="${this._colorToSvg(innerColor, alpha)}" stroke-width="${innerStroke}" 
                stroke-linecap="round"/>`);
        }
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        const points = [];
        const angle = (Math.PI * 2) / numberOfSides;
        
        for (let i = 0; i < numberOfSides; i++) {
            const x = pos.x + radius * Math.cos(angle * i + startAngle * Math.PI / 180);
            const y = pos.y + radius * Math.sin(angle * i + startAngle * Math.PI / 180);
            points.push(`${x},${y}`);
        }
        
        this.elements.push(`<polygon points="${points.join(' ')}" 
            fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawBezierCurve(start, control, end, innerStroke, innerColor, outerStroke, outerColor) {
        const pathData = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
        
        // Draw outer curve
        if (outerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(outerColor)}" stroke-width="${outerStroke}" 
                stroke-linecap="round"/>`);
        }
        
        // Draw inner curve
        if (innerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(innerColor)}" stroke-width="${innerStroke}" 
                stroke-linecap="round"/>`);
        }
    }

    async drawPath(segment, innerStroke, innerColor, outerStroke, outerColor) {
        let pathData = '';
        
        if (Array.isArray(segment)) {
            // Handle array of points - convert to SVG path
            if (segment.length < 2) return;
            
            pathData = `M ${segment[0].x} ${segment[0].y}`;
            for (let i = 1; i < segment.length; i++) {
                if (segment[i] && segment[i].x != null && segment[i].y != null) {
                    pathData += ` L ${segment[i].x} ${segment[i].y}`;
                }
            }
        } else if (typeof segment === 'string') {
            // Handle SVG path string directly
            pathData = segment;
        } else {
            return;
        }
        
        // Draw outer path
        if (outerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(outerColor)}" stroke-width="${outerStroke}" 
                stroke-linecap="round" stroke-linejoin="round"/>`);
        }
        
        // Draw inner path
        if (innerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" 
                stroke="${this._colorToSvg(innerColor)}" stroke-width="${innerStroke}" 
                stroke-linecap="round" stroke-linejoin="round"/>`);
        }
    }

    async drawGradientRect(x, y, width, height, colorStops) {
        const gradientId = `rectGradient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        let stops = '';
        for (const stop of colorStops) {
            stops += `<stop offset="${stop.offset * 100}%" style="stop-color:${this._colorToSvg(stop.color)};stop-opacity:1"/>`;
        }
        
        this.elements.push(`<defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
                ${stops}
            </linearGradient>
        </defs>`);
        
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" 
            fill="url(#${gradientId})"/>`);
    }
}
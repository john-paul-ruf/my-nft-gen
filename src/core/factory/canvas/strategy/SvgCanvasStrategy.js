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
        this._idCounter = 0;
        this._stateStack = [];
        this._globalAlpha = 1;
        this._blendMode = 'normal';
        this._transforms = [];
        this._activeFilterId = null;
        this._activeClipId = null;
        this._groupDepth = 0;
    }

    _nextId(prefix = 'id') {
        return `${prefix}_${this._idCounter++}`;
    }

    _buildTransformString() {
        if (this._transforms.length === 0) return '';
        return this._transforms.join(' ');
    }

    _applyStateAttrs(element) {
        const transform = this._buildTransformString();
        if (transform) {
            element = element.replace(/\/>$/, ` transform="${transform}"/>`);
            element = element.replace(/<\/(\w+)>$/, ` transform="${transform}"></$1>`);
        }
        return element;
    }

    saveState() {
        this._stateStack.push({
            globalAlpha: this._globalAlpha,
            blendMode: this._blendMode,
            transforms: [...this._transforms],
            activeFilterId: this._activeFilterId,
            activeClipId: this._activeClipId,
        });
    }

    restoreState() {
        if (this._stateStack.length === 0) return;
        const state = this._stateStack.pop();
        this._globalAlpha = state.globalAlpha;
        this._blendMode = state.blendMode;
        this._transforms = state.transforms;
        this._activeFilterId = state.activeFilterId;
        this._activeClipId = state.activeClipId;
    }

    setGlobalAlpha(alpha) {
        this._globalAlpha = alpha;
    }

    setBlendMode(mode) {
        this._blendMode = mode;
    }

    translate(x, y) {
        this._transforms.push(`translate(${x}, ${y})`);
    }

    rotate(angle, cx, cy) {
        if (cx !== undefined && cy !== undefined) {
            this._transforms.push(`rotate(${angle}, ${cx}, ${cy})`);
        } else {
            this._transforms.push(`rotate(${angle})`);
        }
    }

    scale(sx, sy) {
        if (sy === undefined) sy = sx;
        this._transforms.push(`scale(${sx}, ${sy})`);
    }

    resetTransform() {
        this._transforms = [];
    }

    beginGroup(options = {}) {
        const { transform, opacity, blendMode, clipPath } = options;
        let attrs = [];
        if (transform) attrs.push(`transform="${transform}"`);
        if (opacity !== undefined) attrs.push(`opacity="${opacity}"`);
        if (blendMode) attrs.push(`style="mix-blend-mode: ${blendMode}"`);
        if (clipPath) attrs.push(`clip-path="url(#${clipPath})"`);
        const transformStr = this._buildTransformString();
        if (!transform && transformStr) attrs.push(`transform="${transformStr}"`);
        this.elements.push(`<g ${attrs.join(' ')}>`);
        this._groupDepth++;
    }

    endGroup() {
        if (this._groupDepth > 0) {
            this.elements.push(`</g>`);
            this._groupDepth--;
        }
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

    /**
     * Draw text with Unicode support
     * @param {string} text - The text to draw (supports Unicode characters)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} options - Text styling options
     * @param {string} options.fontFamily - Font family (default: 'Arial, sans-serif')
     * @param {number} options.fontSize - Font size in pixels (default: 16)
     * @param {string} options.fontWeight - Font weight (default: 'normal')
     * @param {string} options.fontStyle - Font style (default: 'normal')
     * @param {string} options.color - Text color (default: '#000000')
     * @param {number} options.alpha - Text opacity 0-1 (default: 1)
     * @param {string} options.textAnchor - Text alignment: 'start', 'middle', 'end' (default: 'start')
     * @param {string} options.dominantBaseline - Vertical alignment: 'auto', 'middle', 'hanging', 'alphabetic' (default: 'alphabetic')
     * @param {number} options.letterSpacing - Letter spacing in pixels (default: 0)
     * @param {string} options.textDecoration - Text decoration: 'none', 'underline', 'line-through' (default: 'none')
     * @param {number} options.strokeWidth - Outline width (default: 0)
     * @param {string} options.strokeColor - Outline color (default: '#000000')
     * @param {number} options.rotation - Rotation angle in degrees (default: 0)
     */
    async drawText(text, x, y, options = {}) {
        const {
            fontFamily = 'Arial, sans-serif',
            fontSize = 16,
            fontWeight = 'normal',
            fontStyle = 'normal',
            color = '#000000',
            alpha = 1,
            textAnchor = 'start',
            dominantBaseline = 'alphabetic',
            letterSpacing = 0,
            textDecoration = 'none',
            strokeWidth = 0,
            strokeColor = '#000000',
            rotation = 0
        } = options;

        // Escape special XML characters in text
        const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        // Build style string
        const styles = [
            `font-family: ${fontFamily}`,
            `font-size: ${fontSize}px`,
            `font-weight: ${fontWeight}`,
            `font-style: ${fontStyle}`,
            `fill: ${this._colorToSvg(color, alpha)}`,
            `text-anchor: ${textAnchor}`,
            `dominant-baseline: ${dominantBaseline}`
        ];

        if (letterSpacing !== 0) {
            styles.push(`letter-spacing: ${letterSpacing}px`);
        }

        if (textDecoration !== 'none') {
            styles.push(`text-decoration: ${textDecoration}`);
        }

        // Build stroke attributes
        let strokeAttrs = '';
        if (strokeWidth > 0) {
            strokeAttrs = `stroke="${this._colorToSvg(strokeColor)}" stroke-width="${strokeWidth}"`;
        }

        // Build transform attribute
        let transformAttr = '';
        if (rotation !== 0) {
            transformAttr = `transform="rotate(${rotation} ${x} ${y})"`;
        }

        // Add text element
        this.elements.push(
            `<text x="${x}" y="${y}" style="${styles.join('; ')}" ${strokeAttrs} ${transformAttr}>${escapedText}</text>`
        );
    }

    async drawCircle2d(pos, radius, stroke, color, alpha = 1) {
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}"/>`);
    }

    async drawFilledCircle2d(pos, radius, fillColor, alpha = 1) {
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawRect2d(x, y, width, height, stroke, color, alpha = 1) {
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}"/>`);
    }

    async drawFilledRect2d(x, y, width, height, fillColor, alpha = 1) {
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawRoundedRect2d(x, y, width, height, cornerRadius, stroke, color, alpha = 1) {
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}"/>`);
    }

    async drawFilledRoundedRect2d(x, y, width, height, cornerRadius, fillColor, alpha = 1) {
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawEllipse2d(pos, rx, ry, stroke, color, alpha = 1) {
        this.elements.push(`<ellipse cx="${pos.x}" cy="${pos.y}" rx="${rx}" ry="${ry}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}"/>`);
    }

    async drawFilledEllipse2d(pos, rx, ry, fillColor, alpha = 1) {
        this.elements.push(`<ellipse cx="${pos.x}" cy="${pos.y}" rx="${rx}" ry="${ry}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawArc2d(pos, radius, startAngle, endAngle, stroke, color, alpha = 1) {
        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;
        const x1 = pos.x + radius * Math.cos(startRad);
        const y1 = pos.y + radius * Math.sin(startRad);
        const x2 = pos.x + radius * Math.cos(endRad);
        const y2 = pos.y + radius * Math.sin(endRad);
        const largeArc = (endAngle - startAngle + 360) % 360 > 180 ? 1 : 0;
        this.elements.push(`<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-linecap="round"/>`);
    }

    async drawFilledArc2d(pos, radius, startAngle, endAngle, fillColor, alpha = 1) {
        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;
        const x1 = pos.x + radius * Math.cos(startRad);
        const y1 = pos.y + radius * Math.sin(startRad);
        const x2 = pos.x + radius * Math.cos(endRad);
        const y2 = pos.y + radius * Math.sin(endRad);
        const largeArc = (endAngle - startAngle + 360) % 360 > 180 ? 1 : 0;
        this.elements.push(`<path d="M ${pos.x} ${pos.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawDot(pos, radius, color, alpha = 1) {
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${this._colorToSvg(color, alpha)}" stroke="none"/>`);
    }

    async drawDots(positions, radius, color, alpha = 1) {
        const fill = this._colorToSvg(color, alpha);
        for (const pos of positions) {
            this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="${fill}" stroke="none"/>`);
        }
    }

    async drawCubicBezier(start, control1, control2, end, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        const pathData = `M ${start.x} ${start.y} C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`;
        if (outerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" stroke="${this._colorToSvg(outerColor, alpha)}" stroke-width="${outerStroke}" stroke-linecap="round"/>`);
        }
        if (innerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" stroke="${this._colorToSvg(innerColor, alpha)}" stroke-width="${innerStroke}" stroke-linecap="round"/>`);
        }
    }

    async drawSpline(points, tension = 0.5, innerStroke, innerColor, outerStroke, outerColor, closed = false, alpha = 1) {
        if (!points || points.length < 2) return;
        const pts = closed ? [...points, points[0], points[1], points[2] || points[0]] : points;
        let pathData = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(i - 1, 0)];
            const p1 = pts[i];
            const p2 = pts[Math.min(i + 1, pts.length - 1)];
            const p3 = pts[Math.min(i + 2, pts.length - 1)];
            const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
            const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
            const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
            const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
            pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
        }
        if (closed) pathData += ' Z';
        if (outerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" stroke="${this._colorToSvg(outerColor, alpha)}" stroke-width="${outerStroke}" stroke-linecap="round" stroke-linejoin="round"/>`);
        }
        if (innerStroke > 0) {
            this.elements.push(`<path d="${pathData}" fill="none" stroke="${this._colorToSvg(innerColor, alpha)}" stroke-width="${innerStroke}" stroke-linecap="round" stroke-linejoin="round"/>`);
        }
    }

    _generateStarPoints(pos, outerRadius, innerRadius, points, startAngle) {
        const coords = [];
        const totalPoints = points * 2;
        const angleStep = 360 / totalPoints;
        for (let i = 0; i < totalPoints; i++) {
            const angle = (startAngle + angleStep * i) * Math.PI / 180;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            coords.push({
                x: pos.x + r * Math.cos(angle),
                y: pos.y + r * Math.sin(angle),
            });
        }
        return coords.map(p => `${p.x},${p.y}`).join(' ');
    }

    async drawStar2d(pos, outerRadius, innerRadius, points, startAngle, stroke, color, alpha = 1) {
        const pointsStr = this._generateStarPoints(pos, outerRadius, innerRadius, points, startAngle);
        this.elements.push(`<polygon points="${pointsStr}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-linejoin="round"/>`);
    }

    async drawFilledStar2d(pos, outerRadius, innerRadius, points, startAngle, fillColor, alpha = 1) {
        const pointsStr = this._generateStarPoints(pos, outerRadius, innerRadius, points, startAngle);
        this.elements.push(`<polygon points="${pointsStr}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawCross2d(pos, size, thickness, stroke, color, alpha = 1) {
        const half = size / 2;
        const hThick = thickness / 2;
        const crossPoints = [
            `${pos.x - hThick},${pos.y - half}`,
            `${pos.x + hThick},${pos.y - half}`,
            `${pos.x + hThick},${pos.y - hThick}`,
            `${pos.x + half},${pos.y - hThick}`,
            `${pos.x + half},${pos.y + hThick}`,
            `${pos.x + hThick},${pos.y + hThick}`,
            `${pos.x + hThick},${pos.y + half}`,
            `${pos.x - hThick},${pos.y + half}`,
            `${pos.x - hThick},${pos.y + hThick}`,
            `${pos.x - half},${pos.y + hThick}`,
            `${pos.x - half},${pos.y - hThick}`,
            `${pos.x - hThick},${pos.y - hThick}`,
        ].join(' ');
        this.elements.push(`<polygon points="${crossPoints}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-linejoin="miter"/>`);
    }

    async drawArrow2d(start, end, headLength, headWidth, stroke, color, alpha = 1) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        const halfHead = headWidth / 2;
        const baseX = end.x - headLength * Math.cos(angle);
        const baseY = end.y - headLength * Math.sin(angle);
        const left = {
            x: baseX + halfHead * Math.cos(angle + Math.PI / 2),
            y: baseY + halfHead * Math.sin(angle + Math.PI / 2),
        };
        const right = {
            x: baseX + halfHead * Math.cos(angle - Math.PI / 2),
            y: baseY + halfHead * Math.sin(angle - Math.PI / 2),
        };
        this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${baseX}" y2="${baseY}" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-linecap="round"/>`);
        this.elements.push(`<polygon points="${left.x},${left.y} ${end.x},${end.y} ${right.x},${right.y}" fill="${this._colorToSvg(color, alpha)}" stroke="none"/>`);
    }

    async drawCustomPolygon2d(points, stroke, color, alpha = 1) {
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        this.elements.push(`<polygon points="${pointsStr}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-linejoin="round"/>`);
    }

    async drawFilledCustomPolygon2d(points, fillColor, alpha = 1) {
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        this.elements.push(`<polygon points="${pointsStr}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawFilledPath2d(segment, fillColor, alpha = 1) {
        let pathData = '';
        if (Array.isArray(segment)) {
            if (segment.length < 2) return;
            pathData = `M ${segment[0].x} ${segment[0].y}`;
            for (let i = 1; i < segment.length; i++) {
                if (segment[i] && segment[i].x != null && segment[i].y != null) {
                    pathData += ` L ${segment[i].x} ${segment[i].y}`;
                }
            }
            pathData += ' Z';
        } else if (typeof segment === 'string') {
            pathData = segment;
        } else {
            return;
        }
        this.elements.push(`<path d="${pathData}" fill="${this._colorToSvg(fillColor, alpha)}" stroke="none"/>`);
    }

    async drawRadialGradient(pos, innerRadius, outerRadius, colorStops) {
        const gradientId = this._nextId('radGrad');
        let stops = '';
        for (const stop of colorStops) {
            stops += `<stop offset="${stop.offset * 100}%" style="stop-color:${this._colorToSvg(stop.color)};stop-opacity:1"/>`;
        }
        this.elements.push(`<defs><radialGradient id="${gradientId}" cx="${pos.x}" cy="${pos.y}" r="${outerRadius}" fx="${pos.x}" fy="${pos.y}" gradientUnits="userSpaceOnUse"><circle r="${innerRadius}"/>${stops}</radialGradient></defs>`);
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${outerRadius}" fill="url(#${gradientId})" stroke="none"/>`);
    }

    async drawLinearGradientLine2d(startPos, endPos, stroke, colorStops) {
        const gradientId = this._nextId('linGrad');
        let stops = '';
        for (const stop of colorStops) {
            stops += `<stop offset="${stop.offset * 100}%" style="stop-color:${this._colorToSvg(stop.color)};stop-opacity:1"/>`;
        }
        this.elements.push(`<defs><linearGradient id="${gradientId}" x1="${startPos.x}" y1="${startPos.y}" x2="${endPos.x}" y2="${endPos.y}" gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs>`);
        this.elements.push(`<line x1="${startPos.x}" y1="${startPos.y}" x2="${endPos.x}" y2="${endPos.y}" stroke="url(#${gradientId})" stroke-width="${stroke}" stroke-linecap="round"/>`);
    }

    async drawGradientRing2d(pos, radius, stroke, colorStops) {
        const gradientId = this._nextId('ringGrad');
        let stops = '';
        for (const stop of colorStops) {
            stops += `<stop offset="${stop.offset * 100}%" style="stop-color:${this._colorToSvg(stop.color)};stop-opacity:1"/>`;
        }
        this.elements.push(`<defs><linearGradient id="${gradientId}" x1="${pos.x - radius}" y1="${pos.y}" x2="${pos.x + radius}" y2="${pos.y}" gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs>`);
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="none" stroke="url(#${gradientId})" stroke-width="${stroke}"/>`);
    }

    async drawGradientPath2d(segment, stroke, colorStops) {
        let pathData = '';
        if (Array.isArray(segment)) {
            if (segment.length < 2) return;
            pathData = `M ${segment[0].x} ${segment[0].y}`;
            for (let i = 1; i < segment.length; i++) {
                if (segment[i] && segment[i].x != null && segment[i].y != null) {
                    pathData += ` L ${segment[i].x} ${segment[i].y}`;
                }
            }
        } else if (typeof segment === 'string') {
            pathData = segment;
        } else {
            return;
        }
        const gradientId = this._nextId('pathGrad');
        let stops = '';
        for (const stop of colorStops) {
            stops += `<stop offset="${stop.offset * 100}%" style="stop-color:${this._colorToSvg(stop.color)};stop-opacity:1"/>`;
        }
        this.elements.push(`<defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">${stops}</linearGradient></defs>`);
        this.elements.push(`<path d="${pathData}" fill="none" stroke="url(#${gradientId})" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }

    async drawDashedLine2d(start, end, stroke, color, dashArray, alpha = 1) {
        const dashStr = Array.isArray(dashArray) ? dashArray.join(',') : dashArray;
        this.elements.push(`<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-dasharray="${dashStr}" stroke-linecap="round"/>`);
    }

    async drawDashedRing2d(pos, radius, stroke, color, dashArray, alpha = 1) {
        const dashStr = Array.isArray(dashArray) ? dashArray.join(',') : dashArray;
        this.elements.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${radius}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-dasharray="${dashStr}"/>`);
    }

    async drawDashedRect2d(x, y, width, height, stroke, color, dashArray, alpha = 1) {
        const dashStr = Array.isArray(dashArray) ? dashArray.join(',') : dashArray;
        this.elements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${this._colorToSvg(color, alpha)}" stroke-width="${stroke}" stroke-dasharray="${dashStr}"/>`);
    }

    async drawGrid2d(x, y, width, height, cellWidth, cellHeight, stroke, color, alpha = 1) {
        const svgColor = this._colorToSvg(color, alpha);
        let lines = '';
        for (let gx = x; gx <= x + width; gx += cellWidth) {
            lines += `<line x1="${gx}" y1="${y}" x2="${gx}" y2="${y + height}" stroke="${svgColor}" stroke-width="${stroke}"/>`;
        }
        for (let gy = y; gy <= y + height; gy += cellHeight) {
            lines += `<line x1="${x}" y1="${gy}" x2="${x + width}" y2="${gy}" stroke="${svgColor}" stroke-width="${stroke}"/>`;
        }
        this.elements.push(lines);
    }

    setClipRect(x, y, width, height) {
        const clipId = this._nextId('clipRect');
        this._activeClipId = clipId;
        this.elements.push(`<defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs>`);
        this.elements.push(`<g clip-path="url(#${clipId})">`);
        this._groupDepth++;
    }

    setClipCircle(pos, radius) {
        const clipId = this._nextId('clipCircle');
        this._activeClipId = clipId;
        this.elements.push(`<defs><clipPath id="${clipId}"><circle cx="${pos.x}" cy="${pos.y}" r="${radius}"/></clipPath></defs>`);
        this.elements.push(`<g clip-path="url(#${clipId})">`);
        this._groupDepth++;
    }

    setClipPath(points) {
        const clipId = this._nextId('clipPath');
        this._activeClipId = clipId;
        let pathData = '';
        if (Array.isArray(points) && points.length >= 2) {
            pathData = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                pathData += ` L ${points[i].x} ${points[i].y}`;
            }
            pathData += ' Z';
        } else if (typeof points === 'string') {
            pathData = points;
        }
        this.elements.push(`<defs><clipPath id="${clipId}"><path d="${pathData}"/></clipPath></defs>`);
        this.elements.push(`<g clip-path="url(#${clipId})">`);
        this._groupDepth++;
    }

    clearClip() {
        if (this._activeClipId) {
            this.elements.push(`</g>`);
            this._groupDepth = Math.max(0, this._groupDepth - 1);
            this._activeClipId = null;
        }
    }

    applyGaussianBlur(stdDeviation) {
        const filterId = this._nextId('blur');
        this._activeFilterId = filterId;
        this.elements.push(`<defs><filter id="${filterId}"><feGaussianBlur stdDeviation="${stdDeviation}"/></filter></defs>`);
        this.elements.push(`<g filter="url(#${filterId})">`);
        this._groupDepth++;
    }

    applyDropShadow(dx, dy, stdDeviation, color) {
        const filterId = this._nextId('shadow');
        this._activeFilterId = filterId;
        const svgColor = this._colorToSvg(color);
        this.elements.push(`<defs><filter id="${filterId}"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${stdDeviation}" flood-color="${svgColor}"/></filter></defs>`);
        this.elements.push(`<g filter="url(#${filterId})">`);
        this._groupDepth++;
    }

    applyGlow(stdDeviation, color) {
        const filterId = this._nextId('glow');
        this._activeFilterId = filterId;
        const svgColor = this._colorToSvg(color);
        this.elements.push(`<defs><filter id="${filterId}"><feGaussianBlur stdDeviation="${stdDeviation}" result="blur"/><feFlood flood-color="${svgColor}" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`);
        this.elements.push(`<g filter="url(#${filterId})">`);
        this._groupDepth++;
    }

    clearFilters() {
        if (this._activeFilterId) {
            this.elements.push(`</g>`);
            this._groupDepth = Math.max(0, this._groupDepth - 1);
            this._activeFilterId = null;
        }
    }

    async drawImage(buffer, x, y, width, height, alpha = 1) {
        let base64;
        if (Buffer.isBuffer(buffer)) {
            base64 = buffer.toString('base64');
        } else if (typeof buffer === 'string') {
            base64 = buffer;
        } else {
            return;
        }
        let attrs = `x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/png;base64,${base64}"`;
        if (alpha < 1) {
            attrs += ` opacity="${alpha}"`;
        }
        this.elements.push(`<image ${attrs}/>`);
    }

    async drawTextOnPath(text, pathData, options = {}) {
        const {
            fontFamily = 'Arial, sans-serif',
            fontSize = 16,
            fontWeight = 'normal',
            color = '#000000',
            alpha = 1,
            startOffset = '0%',
            letterSpacing = 0,
        } = options;

        const pathId = this._nextId('textPath');
        const escapedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        let svgPathData = '';
        if (Array.isArray(pathData)) {
            if (pathData.length < 2) return;
            svgPathData = `M ${pathData[0].x} ${pathData[0].y}`;
            for (let i = 1; i < pathData.length; i++) {
                svgPathData += ` L ${pathData[i].x} ${pathData[i].y}`;
            }
        } else if (typeof pathData === 'string') {
            svgPathData = pathData;
        } else {
            return;
        }

        const styles = [
            `font-family: ${fontFamily}`,
            `font-size: ${fontSize}px`,
            `font-weight: ${fontWeight}`,
            `fill: ${this._colorToSvg(color, alpha)}`,
        ];
        if (letterSpacing !== 0) {
            styles.push(`letter-spacing: ${letterSpacing}px`);
        }

        this.elements.push(`<defs><path id="${pathId}" d="${svgPathData}"/></defs>`);
        this.elements.push(`<text style="${styles.join('; ')}"><textPath href="#${pathId}" startOffset="${startOffset}">${escapedText}</textPath></text>`);
    }
}
export class Canvas2d {
    constructor(strategy) {
        this.strategy = strategy;
    }

    /** *
     *
     * replaces current canvas with new canvas
     *
     * @param width
     * @param height
     * @returns {Promise<void>}
     */
    async newCanvas(width, height) {
        await this.strategy.newCanvas(width, height);
    }

    /** *
     *
     * replaces current canvas with image from file
     *
     * @param filename
     * @returns {Promise<void>}
     */
    async toFile(filename) {
        await this.strategy.toFile(filename);
    }

    async convertToLayer() {
        return this.strategy.convertToLayer();
    }

    dispose() {
        if (this.strategy.dispose) {
            this.strategy.dispose();
        }
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha) {
        await this.strategy.drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha);
    }

    async drawRay2d(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor) {
        await this.strategy.drawRay2d(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        await this.strategy.drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha) {
        await this.strategy.drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha);
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        await this.strategy.drawGradientLine2d(startPos, endPos, stroke, startColor, endColor);
    }

    async drawLine2d(startPos, endPos, innerStroke, innerColor, outerStroke, outerColor, alpha) {
        await this.strategy.drawLine2d(startPos, endPos, innerStroke, innerColor, outerStroke, outerColor, alpha);
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        await this.strategy.drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha);
    }

    async drawBezierCurve(start, control, end, innerStroke, innerColor, outerStroke, outerColor){
        await this.strategy.drawBezierCurve(start, control, end, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawPath(segment, innerStroke, innerColor, outerStroke, outerColor){
        await this.strategy.drawPath(segment, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawGradientRect(x, y, width, height, colorStops) {
        await this.strategy.drawGradientRect(x, y, width, height, colorStops);
    }

    async drawText(text, x, y, options = {}) {
        await this.strategy.drawText(text, x, y, options);
    }

    saveState() {
        this.strategy.saveState();
    }

    restoreState() {
        this.strategy.restoreState();
    }

    setGlobalAlpha(alpha) {
        this.strategy.setGlobalAlpha(alpha);
    }

    setBlendMode(mode) {
        this.strategy.setBlendMode(mode);
    }

    translate(x, y) {
        this.strategy.translate(x, y);
    }

    rotate(angle, cx, cy) {
        this.strategy.rotate(angle, cx, cy);
    }

    scale(sx, sy) {
        this.strategy.scale(sx, sy);
    }

    resetTransform() {
        this.strategy.resetTransform();
    }

    beginGroup(options = {}) {
        this.strategy.beginGroup(options);
    }

    endGroup() {
        this.strategy.endGroup();
    }

    async drawCircle2d(pos, radius, stroke, color, alpha) {
        await this.strategy.drawCircle2d(pos, radius, stroke, color, alpha);
    }

    async drawFilledCircle2d(pos, radius, fillColor, alpha) {
        await this.strategy.drawFilledCircle2d(pos, radius, fillColor, alpha);
    }

    async drawRect2d(x, y, width, height, stroke, color, alpha) {
        await this.strategy.drawRect2d(x, y, width, height, stroke, color, alpha);
    }

    async drawFilledRect2d(x, y, width, height, fillColor, alpha) {
        await this.strategy.drawFilledRect2d(x, y, width, height, fillColor, alpha);
    }

    async drawRoundedRect2d(x, y, width, height, cornerRadius, stroke, color, alpha) {
        await this.strategy.drawRoundedRect2d(x, y, width, height, cornerRadius, stroke, color, alpha);
    }

    async drawFilledRoundedRect2d(x, y, width, height, cornerRadius, fillColor, alpha) {
        await this.strategy.drawFilledRoundedRect2d(x, y, width, height, cornerRadius, fillColor, alpha);
    }

    async drawEllipse2d(pos, rx, ry, stroke, color, alpha) {
        await this.strategy.drawEllipse2d(pos, rx, ry, stroke, color, alpha);
    }

    async drawFilledEllipse2d(pos, rx, ry, fillColor, alpha) {
        await this.strategy.drawFilledEllipse2d(pos, rx, ry, fillColor, alpha);
    }

    async drawArc2d(pos, radius, startAngle, endAngle, stroke, color, alpha) {
        await this.strategy.drawArc2d(pos, radius, startAngle, endAngle, stroke, color, alpha);
    }

    async drawFilledArc2d(pos, radius, startAngle, endAngle, fillColor, alpha) {
        await this.strategy.drawFilledArc2d(pos, radius, startAngle, endAngle, fillColor, alpha);
    }

    async drawDot(pos, radius, color, alpha) {
        await this.strategy.drawDot(pos, radius, color, alpha);
    }

    async drawDots(positions, radius, color, alpha) {
        await this.strategy.drawDots(positions, radius, color, alpha);
    }

    async drawCubicBezier(start, control1, control2, end, innerStroke, innerColor, outerStroke, outerColor, alpha) {
        await this.strategy.drawCubicBezier(start, control1, control2, end, innerStroke, innerColor, outerStroke, outerColor, alpha);
    }

    async drawSpline(points, tension, innerStroke, innerColor, outerStroke, outerColor, closed, alpha) {
        await this.strategy.drawSpline(points, tension, innerStroke, innerColor, outerStroke, outerColor, closed, alpha);
    }

    async drawStar2d(pos, outerRadius, innerRadius, points, startAngle, stroke, color, alpha) {
        await this.strategy.drawStar2d(pos, outerRadius, innerRadius, points, startAngle, stroke, color, alpha);
    }

    async drawFilledStar2d(pos, outerRadius, innerRadius, points, startAngle, fillColor, alpha) {
        await this.strategy.drawFilledStar2d(pos, outerRadius, innerRadius, points, startAngle, fillColor, alpha);
    }

    async drawCross2d(pos, size, thickness, stroke, color, alpha) {
        await this.strategy.drawCross2d(pos, size, thickness, stroke, color, alpha);
    }

    async drawArrow2d(start, end, headLength, headWidth, stroke, color, alpha) {
        await this.strategy.drawArrow2d(start, end, headLength, headWidth, stroke, color, alpha);
    }

    async drawCustomPolygon2d(points, stroke, color, alpha) {
        await this.strategy.drawCustomPolygon2d(points, stroke, color, alpha);
    }

    async drawFilledCustomPolygon2d(points, fillColor, alpha) {
        await this.strategy.drawFilledCustomPolygon2d(points, fillColor, alpha);
    }

    async drawFilledPath2d(segment, fillColor, alpha) {
        await this.strategy.drawFilledPath2d(segment, fillColor, alpha);
    }

    async drawRadialGradient(pos, innerRadius, outerRadius, colorStops) {
        await this.strategy.drawRadialGradient(pos, innerRadius, outerRadius, colorStops);
    }

    async drawLinearGradientLine2d(startPos, endPos, stroke, colorStops) {
        await this.strategy.drawLinearGradientLine2d(startPos, endPos, stroke, colorStops);
    }

    async drawGradientRing2d(pos, radius, stroke, colorStops) {
        await this.strategy.drawGradientRing2d(pos, radius, stroke, colorStops);
    }

    async drawGradientPath2d(segment, stroke, colorStops) {
        await this.strategy.drawGradientPath2d(segment, stroke, colorStops);
    }

    async drawDashedLine2d(start, end, stroke, color, dashArray, alpha) {
        await this.strategy.drawDashedLine2d(start, end, stroke, color, dashArray, alpha);
    }

    async drawDashedRing2d(pos, radius, stroke, color, dashArray, alpha) {
        await this.strategy.drawDashedRing2d(pos, radius, stroke, color, dashArray, alpha);
    }

    async drawDashedRect2d(x, y, width, height, stroke, color, dashArray, alpha) {
        await this.strategy.drawDashedRect2d(x, y, width, height, stroke, color, dashArray, alpha);
    }

    async drawGrid2d(x, y, width, height, cellWidth, cellHeight, stroke, color, alpha) {
        await this.strategy.drawGrid2d(x, y, width, height, cellWidth, cellHeight, stroke, color, alpha);
    }

    setClipRect(x, y, width, height) {
        this.strategy.setClipRect(x, y, width, height);
    }

    setClipCircle(pos, radius) {
        this.strategy.setClipCircle(pos, radius);
    }

    setClipPath(points) {
        this.strategy.setClipPath(points);
    }

    clearClip() {
        this.strategy.clearClip();
    }

    applyGaussianBlur(stdDeviation) {
        this.strategy.applyGaussianBlur(stdDeviation);
    }

    applyDropShadow(dx, dy, stdDeviation, color) {
        this.strategy.applyDropShadow(dx, dy, stdDeviation, color);
    }

    applyGlow(stdDeviation, color) {
        this.strategy.applyGlow(stdDeviation, color);
    }

    clearFilters() {
        this.strategy.clearFilters();
    }

    async drawImage(buffer, x, y, width, height, alpha) {
        await this.strategy.drawImage(buffer, x, y, width, height, alpha);
    }

    async drawTextOnPath(text, pathData, options = {}) {
        await this.strategy.drawTextOnPath(text, pathData, options);
    }
}

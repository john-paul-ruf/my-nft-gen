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
}

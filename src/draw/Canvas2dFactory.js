import {createCanvas} from "canvas";
import fs from "fs";
import {degreesToRadians, findPointByAngleAndCircle} from "../logic/math/drawingMath.js";
import {getCanvasStrategy} from "../logic/core/gobals.js";


class nodeCanvasStrategy {
    constructor() {
        this.internalRepresentation = null;
    }

    async newCanvas(width, height) {
        this.canvas = createCanvas(width, height)
        this.context = this.canvas.getContext('2d');
    }

    async toFile(filename) {
        const buffer = this.canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor) {
        this.context.beginPath();

        this.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

        this.context.lineWidth = outerStroke + innerStroke;
        this.context.strokeStyle = outerColor;

        this.context.stroke();

        this.context.closePath();
        this.context.beginPath();

        this.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

        this.context.lineWidth = innerStroke;
        this.context.strokeStyle = innerColor;

        this.context.stroke();
        this.context.closePath();
    }

    async drawRay2d(pos, stroke, color, innerColor, angle, radius, length) {
        const start = findPointByAngleAndCircle(pos, angle, radius)
        const end = findPointByAngleAndCircle(pos, angle, radius + length);

        this.context.beginPath();

        const grad = this.context.createLinearGradient(start.x, start.y, end.x, end.y);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, innerColor);
        grad.addColorStop(1, color);

        this.context.lineWidth = stroke;
        this.context.strokeStyle = grad;

        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);

        this.context.stroke();
        this.context.closePath();
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        for (let i = 0; i < 360; i = i + sparsityFactor) {
            await this.drawRay2d(pos, innerStroke + outerStroke, outerColor, innerColor, i, radius, length)
            await this.drawRay2d(pos, innerStroke, innerColor, innerColor, i, radius, length)
        }
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor) {
        let angle = (Math.PI * 2) / numberOfSides;

        //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
        this.context.beginPath();

        this.context.save();
        this.context.translate(pos.x, pos.y);
        this.context.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

        this.context.moveTo(radius, 0);

        for (let i = 0; i <= numberOfSides + 1; i++) { //sides plus one for proper end-caps on the polygons
            this.context.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
        }

        this.context.closePath();
        this.context.restore();

        this.context.lineWidth = innerStroke + outerStroke;
        this.context.strokeStyle = outerColor;
        this.context.stroke();

        //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
        this.context.beginPath();

        this.context.save();
        this.context.translate(pos.x, pos.y);
        this.context.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

        this.context.moveTo(radius, 0);

        for (let i = 0; i <= numberOfSides + 1; i++) { //sides plus one for proper end-caps on the polygons
            this.context.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
        }

        this.context.closePath();
        this.context.restore();

        this.context.lineWidth = innerStroke;
        this.context.strokeStyle = innerColor;
        this.context.stroke();
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        this.context.beginPath();

        const grad = this.context.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y);
        grad.addColorStop(0, startColor);
        grad.addColorStop(1, endColor);

        this.context.lineWidth = stroke;
        this.context.strokeStyle = grad;

        this.context.moveTo(startPos.x, startPos.y);
        this.context.lineTo(endPos.x, endPos.y);

        this.context.stroke();
        this.context.closePath();
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        let angle = (Math.PI * 2) / numberOfSides;

        const globalAlpha = this.context.globalAlpha;

        this.context.globalAlpha = alpha;

        //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
        this.context.beginPath();

        this.context.save();
        this.context.translate(pos.x, pos.y);
        this.context.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

        this.context.moveTo(radius, 0);

        for (let i = 0; i <= numberOfSides; i++) {
            this.context.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
        }

        this.context.fillStyle = fillColor;
        this.context.fill();

        this.context.restore();

        this.context.globalAlpha = globalAlpha;
    }
}

class Canvas2d {
    constructor(strategy) {
        this.strategy = strategy
    }

    async newCanvas(width, height) {
        await this.strategy.newCanvas(width, height);
    }

    async toFile(filename) {
        await this.strategy.toFile(filename);
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor) {
        await this.strategy.drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawRay2d(pos, stroke, color, innerColor, angle, radius, length) {
        await this.strategy.drawRay2d(pos, stroke, color, innerColor, angle, radius, length);
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        await this.strategy.drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor) {
        await this.strategy.drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor);
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        await this.strategy.drawGradientLine2d(startPos, endPos, stroke, startColor, endColor);
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        await this.strategy.drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha);
    }
}

export class Canvas2dFactory {
    constructor() {
    }

    static getNewCanvas = async (width, height) => {
        switch (getCanvasStrategy()) {
            case 'node-canvas':
                const canvas = new Canvas2d(new nodeCanvasStrategy())
                await canvas.newCanvas(width, height);
                return canvas;
            /*case 'node-p5':*/

            default:
                throw 'Not a valid layer strategy';
        }
    }
}

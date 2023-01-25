import {createCanvas} from "canvas";
import fs from "fs";
import {degreesToRadians, findPointByAngleAndCircle} from "../../../math/drawingMath.js";
import {hexToRgba} from "../../../utils/hexToRgba.js";

export class NodeCanvasStrategy {
    constructor() {
        this.internalRepresentation = null;
    }

    async newCanvas(width, height) {
        this.canvas = createCanvas(width, height)
        this.context = this.canvas.getContext('2d');
        this.context.antialias = 'subpixel';
        this.context.quality = 'bilinear';
        this.context.patternQuality = 'bilinear'
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high'
    }

    async toFile(filename) {
        const buffer = this.canvas.toBuffer('image/png', {
            compressionLevel: 0, filters: this.canvas.PNG_NO_FILTERS, palette: new Uint8ClampedArray(37 * 4),
        });
        fs.writeFileSync(filename, buffer);
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        this.context.beginPath();

        this.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

        this.context.lineWidth = outerStroke + innerStroke;
        this.context.strokeStyle = hexToRgba(outerColor, alpha);

        this.context.stroke();

        this.context.closePath();

        if (innerStroke !== 0) {
            this.context.beginPath();

            this.context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

            this.context.lineWidth = innerStroke;
            this.context.strokeStyle = hexToRgba(innerColor, alpha);

            this.context.stroke();
            this.context.closePath();
        }
    }

    async drawRay2d(pos, angle, radius, length, innerStroke, innerColor, outerStroke, outerColor) {

        const adjustment = outerStroke;

        let start = findPointByAngleAndCircle(pos, angle, radius - adjustment)
        let end = findPointByAngleAndCircle(pos, angle, radius + length - adjustment);

        let strokeStart = findPointByAngleAndCircle(pos, angle, radius)
        let strokeEnd = findPointByAngleAndCircle(pos, angle, radius + length);

        if (length < 0) {
            start = findPointByAngleAndCircle(pos, angle, radius + adjustment);
            end = findPointByAngleAndCircle(pos, angle, radius + length + adjustment);

            strokeStart = findPointByAngleAndCircle(pos, angle, radius)
            strokeEnd = findPointByAngleAndCircle(pos, angle, radius + length);
        }

        await this.drawLine2d(strokeStart, strokeEnd, innerStroke + outerStroke, outerColor, innerStroke + outerStroke, outerColor);
        await this.drawLine2d(start, end, innerStroke, innerColor, innerStroke, innerColor);

    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        for (let i = 0; i < 360; i = i + sparsityFactor) {
            await this.drawRay2d(pos, i, radius, length, innerStroke, innerColor, outerStroke, outerColor)
        }
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
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
        this.context.strokeStyle = hexToRgba(outerColor, alpha);
        this.context.stroke();

        //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
        if (innerStroke !== 0) {
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
            this.context.strokeStyle = hexToRgba(innerColor, alpha);

            this.context.stroke();
        }
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

        //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
        this.context.beginPath();

        this.context.save();

        this.context.translate(pos.x, pos.y);
        this.context.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

        this.context.moveTo(radius, 0);

        for (let i = 0; i <= numberOfSides; i++) {
            this.context.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
        }

        this.context.fillStyle = hexToRgba(fillColor, alpha);
        this.context.fill();

        this.context.restore();
    }

    async drawLine2d(start, end, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {

        this.context.beginPath();

        this.context.lineWidth = outerStroke + innerStroke;
        this.context.strokeStyle = hexToRgba(outerColor, alpha);

        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);

        this.context.stroke();
        this.context.closePath();

        if (innerStroke > 0) {
            this.context.beginPath();

            this.context.lineWidth = innerStroke;
            this.context.strokeStyle = hexToRgba(innerColor, alpha);

            this.context.moveTo(start.x, start.y);
            this.context.lineTo(end.x, end.y);

            this.context.stroke();
            this.context.closePath();
        }
    }
}
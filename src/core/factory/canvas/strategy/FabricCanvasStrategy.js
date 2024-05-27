import fs from 'fs';
import {findPointByAngleAndCircle} from '../../../math/drawingMath.js';
import {hexToRgba} from '../../../utils/hexToRgba.js';
import {LayerFactory} from '../../layer/LayerFactory.js';
import {fabric} from 'fabric';
import {stream2buffer} from "../../../utils/stream2buffer.js";

export class FabricCanvasStrategy {
    async newCanvas(width, height) {
        this.canvas = new fabric.StaticCanvas(null, {
            backgroundColor: '#00000000',
            width,
            height,
        });
    }


    async toFile(filename) {

        this.canvas.renderAll();

        return new Promise((resolve) => {
            const out = fs.createWriteStream(filename);
            const stream = this.canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => resolve());
        });
    }

    async convertToLayer() {
        this.canvas.renderAll();
        const buffer = await stream2buffer(this.canvas.createPNGStream());
        return LayerFactory.getLayerFromBuffer(buffer);
    }

    async drawRing2d(pos, radius, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        this.canvas.add(new fabric.Circle({
            radius,
            fill: '',
            stroke: hexToRgba(outerColor, alpha),
            strokeWidth: outerStroke,
            left: pos.x - (radius),
            top: pos.y - (radius),
        }));

        this.canvas.add(new fabric.Circle({
            radius,
            fill: '',
            stroke: hexToRgba(innerColor, alpha),
            strokeWidth: innerStroke,
            left: pos.x - (radius),
            top: pos.y - (radius),
        }));
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

        this.canvas.add(new fabric.Line([strokeStart.x, strokeStart.y, strokeEnd.x, strokeEnd.y], {
            stroke: outerColor,
            strokeWidth: outerStroke,
            originX: 'center',
            originY: 'center',
        }));

        this.canvas.add(new fabric.Line([start.x, start.y, end.x, end.y], {
            stroke: innerColor,
            strokeWidth: innerStroke,
            originX: 'center',
            originY: 'center',
        }));
    }

    async drawRays2d(pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) {
        for (let i = 0; i < 360; i += sparsityFactor) {
            await this.drawRay2d(pos, i, radius, length, innerStroke, innerColor, outerStroke, outerColor);
        }
    }

    async drawPolygon2d(radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {

        const pointsArray = [];

        const angle = (Math.PI * 2) / numberOfSides;

        for (let i = 0; i <= numberOfSides + 1; i++) { // sides plus one for proper end-caps on the polygons
            pointsArray.push({x: radius * Math.cos(angle * i), y: radius * Math.sin(angle * i)});
        }

        this.canvas.add(new fabric.Polygon(pointsArray, {
            stroke: hexToRgba(outerColor, alpha),
            strokeWidth: outerStroke,
            originX: 'center',
            originY: 'center',
            left: pos.x - (radius),
            top: pos.y - (radius),
        }));

        this.canvas.add(new fabric.Polygon(pointsArray, {
            stroke: hexToRgba(innerColor, alpha),
            strokeWidth: innerStroke,
            originX: 'center',
            originY: 'center',
            left: pos.x - (radius),
            top: pos.y - (radius),
        }));
    }

    async drawGradientLine2d(startPos, endPos, stroke, startColor, endColor) {
        const gradient = new fabric.Gradient({
            type: 'linear',
            gradientUnits: 'pixels',
            coords: {x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y},
            colorStops: [
                {offset: 0, color: startColor},
                {offset: 1, color: endColor}
            ]
        });

        const line = new fabric.Line([startPos.x, startPos.y, endPos.x, endPos.y], {
            fill: gradient,
            strokeWidth: stroke,
        });

        this.canvas.add(line);
    }

    async drawFilledPolygon2d(radius, pos, numberOfSides, startAngle, fillColor, alpha) {
        const pointsArray = [];

        const angle = (Math.PI * 2) / numberOfSides;

        for (let i = 0; i <= numberOfSides + 1; i++) { // sides plus one for proper end-caps on the polygons
            pointsArray.push({x: radius * Math.cos(angle * i), y: radius * Math.sin(angle * i)});
        }

        this.canvas.add(new fabric.Polygon(pointsArray, {
            fill: hexToRgba(fillColor, alpha),
            originX: 'center',
            originY: 'center',
            left: pos.x - (radius),
            top: pos.y - (radius),
        }));
    }

    async drawLine2d(start, end, innerStroke, innerColor, outerStroke, outerColor, alpha = 1) {
        this.canvas.add(new fabric.Line([start.x, start.y, end.x, end.y], {
            stroke: hexToRgba(outerColor, alpha),
            strokeWidth: outerStroke,
            originX: 'center',
            originY: 'center',
        }));

        this.canvas.add(new fabric.Line([start.x, start.y, end.x, end.y], {
            stroke: hexToRgba(innerColor, alpha),
            strokeWidth: innerStroke,
            originX: 'center',
            originY: 'center',
        }));
    }
}

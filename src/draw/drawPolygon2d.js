import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

export const drawPolygon2d = (context2d, radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor) => {

    context2d.beginPath();

    let start = findPointByAngleAndCircle(pos, startAngle, radius);

    context2d.lineWidth = innerStroke + outerStroke;
    context2d.strokeStyle = outerColor;

    context2d.moveTo(start.x, start.y);

    for (let a = startAngle; a < 360+(startAngle*2); a = a + (360/numberOfSides)) {
        const angle = a % 360
        const point = findPointByAngleAndCircle(pos, a, radius);
        context2d.lineTo(point.x, point.y);
    }

    context2d.lineTo(start.x, start.y);

    context2d.stroke();
    context2d.closePath();

    context2d.beginPath();

    start = findPointByAngleAndCircle(pos, startAngle, radius);

    context2d.lineWidth = innerStroke;
    context2d.strokeStyle = innerColor;

    context2d.moveTo(start.x, start.y);

    for (let a = startAngle; a < 360+startAngle+(startAngle*2); a = a + (360/numberOfSides)) {
        const angle = a % 360
        const point = findPointByAngleAndCircle(pos, angle, radius);
        context2d.lineTo(point.x, point.y);
    }

    context2d.lineTo(start.x, start.y);

    context2d.stroke();
    context2d.closePath();


}
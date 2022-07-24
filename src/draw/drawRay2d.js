import {findPointByAngleAndCircle} from "../logic/drawingMath.js";

export const drawRay2d = (context2d, pos, stroke, color, innerColor, angle, radius, length) => {
    const start = findPointByAngleAndCircle(pos, angle, radius)
    const end = findPointByAngleAndCircle(pos, angle, radius + length);

    context2d.beginPath();

    const grad = context2d.createLinearGradient(start.x, start.y, end.x, end.y);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, innerColor);
    grad.addColorStop(1, color);

    context2d.lineWidth = stroke;
    context2d.strokeStyle = grad;

    context2d.moveTo(start.x, start.y);
    context2d.lineTo(end.x, end.y);

    context2d.stroke();
    context2d.closePath();
}
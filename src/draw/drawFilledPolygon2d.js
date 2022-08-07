import {degreesToRadians} from "../logic/math/drawingMath.js";

export const drawFilledPolygon2d = (context2d, radius, pos, numberOfSides, startAngle, fillColor, alpha) => {

    let angle = (Math.PI * 2) / numberOfSides;

    context2d.globalAlpha = alpha;

    //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
    context2d.beginPath();

    context2d.save();
    context2d.translate(pos.x, pos.y);
    context2d.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

    context2d.moveTo(radius, 0);

    for (let i = 0; i <= numberOfSides; i++) {
        context2d.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
    }

    context2d.fillStyle = fillColor;
    context2d.fill();

    context2d.restore();

}
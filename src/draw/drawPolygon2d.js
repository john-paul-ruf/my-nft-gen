import {degreesToRadians, findPointByAngleAndCircle} from "../logic/drawingMath.js";

export const drawPolygon2d = (context2d, radius, pos, numberOfSides, startAngle, innerStroke, innerColor, outerStroke, outerColor) => {

    let angle = (Math.PI * 2) / numberOfSides;

    //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
    context2d.beginPath();

    context2d.save();
    context2d.translate(pos.x, pos.y);
    context2d.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

    context2d.moveTo(radius, 0);

    for (let i = 0; i <= numberOfSides+1; i++) { //sides plus one for proper end-caps on the polygons
        context2d.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
    }

    context2d.closePath();
    context2d.restore();

    context2d.lineWidth = innerStroke + outerStroke;
    context2d.strokeStyle = outerColor;
    context2d.stroke();

    //this guy is an unsung hero of canvas drawing: https://stackoverflow.com/a/17870579
    context2d.beginPath();

    context2d.save();
    context2d.translate(pos.x, pos.y);
    context2d.rotate(degreesToRadians(startAngle)); //degrees to radians is super important here

    context2d.moveTo(radius, 0);

    for (let i = 0; i <= numberOfSides+1; i++) { //sides plus one for proper end-caps on the polygons
        context2d.lineTo(radius * Math.cos(angle * i), radius * Math.sin(angle * i));
    }

    context2d.closePath();
    context2d.restore();

    context2d.lineWidth = innerStroke;
    context2d.strokeStyle = innerColor;
    context2d.stroke();

}
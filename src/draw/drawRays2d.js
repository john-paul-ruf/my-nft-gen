import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {drawRay2d} from "./drawRay2d.js";

export const drawRays2d = (context2d, pos, radius, length, sparsityFactor, innerStroke, innerColor, outerStroke, outerColor) => {
    for (let i = 0; i < 360; i = i + sparsityFactor) {
        drawRay2d(context2d, pos,  + outerStroke, outerColor, innerColor, i, radius, length)
        drawRay2d(context2d, pos, innerStroke, innerColor, innerColor, i, radius, length)
    }
}
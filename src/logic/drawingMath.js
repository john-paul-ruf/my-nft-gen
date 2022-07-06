import {imageSize} from "./gobals.js";

export const findPointByAngleAndCircle = (angle, radius) => {
    let x = (imageSize/2) + radius * Math.cos(degreesToRadians(angle));
    let y = (imageSize/2) + radius * Math.sin(degreesToRadians(angle));
    return {x: x, y: y};
}

export const degreesToRadians = (degrees) => {
    let pi = Math.PI;
    return degrees * (pi / 180);
}
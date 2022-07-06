export const findPointByAngleAndCircle = (angle, radius) => {
    let x = radius * Math.cos(degreesToRadians(angle));
    let y = radius * Math.sin(degreesToRadians(angle));
    return {x: x, y: y};
}

export const degreesToRadians = (degrees) => {
    let pi = Math.PI;
    return degrees * (pi / 180);
}
//I probably stole this from stack overflow long ago
export const findPointByAngleAndCircle = (pos, angle, radius) => {
    let x = pos.x + radius * Math.cos(degreesToRadians(angle));
    let y = pos.y + radius * Math.sin(degreesToRadians(angle));
    return {x: x, y: y};
}

export const getPointsForLayerAndDensity = (initialNumberOfPoints, scaleByFactor, iteration) => {

    let numberOfPoints = initialNumberOfPoints;

    for (let i = 0; i < iteration; i++) {
        numberOfPoints = numberOfPoints * scaleByFactor;
    }

    return Math.floor(numberOfPoints);
}

//See comment on method above
export const degreesToRadians = (degrees) => {
    let pi = Math.PI;
    return degrees * (pi / 180);
}
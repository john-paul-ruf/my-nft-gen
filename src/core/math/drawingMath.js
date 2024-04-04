// I probably stole this from stack overflow long ago
export const findPointByAngleAndCircle = (pos, angle, radius) => {
    const x = pos.x + radius * Math.cos(degreesToRadians(angle));
    const y = pos.y + radius * Math.sin(degreesToRadians(angle));
    return { x, y };
};

export const getPointsForLayerAndDensity = (initialNumberOfPoints, scaleByFactor, iteration) => {
    let numberOfPoints = initialNumberOfPoints;

    for (let i = 0; i < iteration; i++) {
        numberOfPoints *= scaleByFactor;
    }

    return Math.floor(numberOfPoints);
};

// See comment on method above
export const degreesToRadians = (degrees) => {
    const pi = Math.PI;
    return degrees * (pi / 180);
};

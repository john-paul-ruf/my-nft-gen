export const findPointByDistanceBetweenTwoPoints = (point1, point2, distance) => {
    // Calculate the vector between the two points
    let vector = [point2[0] - point1[0], point2[1] - point1[1]];

    // Normalize the vector
    let length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    let unitVector = [vector[0] / length, vector[1] / length];

    // Scale the unit vector to the desired distance
    let newX = point1[0] + unitVector[0] * distance;
    let newY = point1[1] + unitVector[1] * distance;

    return {x: newX, y: newY}
}
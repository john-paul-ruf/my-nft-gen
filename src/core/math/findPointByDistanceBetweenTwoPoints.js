export const findPointByDistanceBetweenTwoPoints = (point1, point2, distance) => {
    // Calculate the vector between the two points
    let vector = {x: point2.x - point1.x, y: point2.y - point1.y};

    // Normalize the vector
    let length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    let unitVector = {x: vector.x / length, y: vector.y / length};

    // Scale the unit vector to the desired distance
    let newX = point1.x + unitVector.x * distance;
    let newY = point1.y + unitVector.y * distance;

    return {x: newX, y: newY}
}
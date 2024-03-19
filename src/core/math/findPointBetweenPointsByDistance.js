export const findPointBetweenPointsByDistance = (distance, point1, point2) => {
    // Calculate the differences between the coordinates of point2 and point1
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    // Calculate the total distance between point1 and point2
    const totalDistance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the ratio of the given distance to the total distance
    const ratio = distance / totalDistance;

    // Calculate the coordinates of the point between point1 and point2
    const x = point1.x + dx * ratio;
    const y = point1.y + dy * ratio;

    return {x: x, y: y};
}
export const drawRing2d = (context2d, pos, radius, innerStroke, innerColor, outerStroke, outerColor) => {

    context2d.beginPath();

    context2d.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

    context2d.lineWidth = outerStroke + innerStroke;
    context2d.strokeStyle = outerColor;

    context2d.stroke();

    context2d.closePath();
    context2d.beginPath();

    context2d.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);

    context2d.lineWidth = innerStroke;
    context2d.strokeStyle = innerColor;

    context2d.stroke();
    context2d.closePath();

}
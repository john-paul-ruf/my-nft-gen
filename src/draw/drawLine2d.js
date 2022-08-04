export const drawGradientLine2d = (context2d, startPos, endPos, stroke, startColor, endColor) => {
    context2d.beginPath();

    const grad = context2d.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y);
    grad.addColorStop(0, startColor);
    grad.addColorStop(1, endColor);

    context2d.lineWidth = stroke;
    context2d.strokeStyle = grad;

    context2d.moveTo(startPos.x, startPos.y);
    context2d.lineTo(endPos.x, endPos.y);

    context2d.stroke();
    context2d.closePath();
}
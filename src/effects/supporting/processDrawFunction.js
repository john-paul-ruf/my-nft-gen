export const processDrawFunction = async (draw, context) => {
    await draw(context, context.drawing);
    await draw(context, context.underlayName);
}
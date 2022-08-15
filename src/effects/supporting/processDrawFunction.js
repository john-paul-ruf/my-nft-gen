/**
 *
 * @param draw - a draw function that produces a file from context.drawing property and context.underlayName property
 * @param context - holds information relevant to creating the drawing
 *
 *  this is still probably a bad idea...
 */
export const processDrawFunction = async (draw, context) => {
    await draw(context, context.drawing);
    await draw(context, context.underlayName);
}
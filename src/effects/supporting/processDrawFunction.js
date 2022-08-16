/**
 *
 * @param draw - a draw function that produces a file from context.drawing property and context.underlayName property
 * @param context - holds information relevant to creating the drawing
 *
 *  this is still probably a bad idea...
 *  update: this was a terrible idea
 *  plan: refactor context into a class which I need to do anyway
 *  invert the process draw call into the context
 */
export const processDrawFunction = async (draw, context) => {

    await draw(context, context.underlayName);

    if (context.theAccentGaston) {
        context.theAccentGaston = 0;
    }

    if (context.useAccentGaston) {
        context.useAccentGaston = false;
    }

    await draw(context, context.drawing);
}
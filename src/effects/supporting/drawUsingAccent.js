export const drawUsingAccent = async (context, draw) => {
    if (context.useAccentGaston) {
        await draw(context.drawing, false, context);
        await draw(context.underlayName, true, context);
    }
}
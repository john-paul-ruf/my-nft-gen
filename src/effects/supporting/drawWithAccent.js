export const drawWithAccent = async (context, draw) => {
    if (typeof context.theAccentGaston === 'number') {
        await draw(context.drawing, 0, context);
        await draw(context.underlayName, context.theAccentGaston, context);
    }
}
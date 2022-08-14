import {LayerFactory} from "../../layer/LayerFactory.js";


//I don't know if this is a good idea...
//ray ring fix, need to define what this is better
export const compositeImage = async (draw, context, layer) => {

    if (context.theAccentGaston) {
        await draw(context.drawing, 0, context);
        await draw(context.underlayName, context.theAccentGaston, context);
    }

    if (context.useAccentGaston) {
        await draw(context.drawing, false, context);
        await draw(context.underlayName, true, context);
    }

    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    if (context.theBlurGaston) {
        await underlayLayer.blur(context.theBlurGaston);
    }

    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer)
    await layer.compositeLayerOver(tempLayer)
}

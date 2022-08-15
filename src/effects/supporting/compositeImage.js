import {LayerFactory} from "../../core/factory/layer/LayerFactory.js";

export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

    if (context.theBlurGaston === 'number') {
        await underlayLayer.blur(context.theBlurGaston);
    }

    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer)
    await layer.compositeLayerOver(tempLayer)
}

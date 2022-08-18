import {LayerFactory} from "../../core/factory/layer/LayerFactory.js";

////////////////////////////////////////////////////////
// Composites two drawings together from the context object
// do we need blur/fade here? it is still doing more than one thing...
// this is still probably a bad idea...
////////////////////////////////////////////////////////
export const compositeImage = async (context, layer) => {
    let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);


    if (typeof context.theBlurGaston === 'number') {
        await underlayLayer.blur(context.theBlurGaston);
    }

    await underlayLayer.adjustLayerOpacity(0.25);
    await tempLayer.adjustLayerOpacity(0.9);

    await tempLayer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);
}

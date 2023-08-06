import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";

export const imageOverlay = async (layer, data) => {
    let tempLayer = await LayerFactory.getLayerFromFile(data.imageOverlay);
    const finalSize = getFinalImageSize();
    await tempLayer.adjustLayerOpacity(data.layerOpacity);
    await tempLayer.resize(finalSize.height - 250, finalSize.width - 250);
    await layer.compositeLayerOver(tempLayer)
}

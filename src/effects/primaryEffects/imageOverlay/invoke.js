import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {GlobalSettings as GlobalSettings} from "../../../core/GlobalSettings.js";

export const imageOverlay = async (layer, data) => {
    let tempLayer = await LayerFactory.getLayerFromFile(data.imageOverlay);
    const finalSize = GlobalSettings.getFinalImageSize();
    await tempLayer.adjustLayerOpacity(data.layerOpacity);
    await tempLayer.resize(finalSize.height - data.buffer, finalSize.width - data.buffer);
    await layer.compositeLayerOver(tempLayer)
}
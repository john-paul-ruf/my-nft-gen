import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";


export const porousOverlay = async (layer, data) => {
    let tempLayer = await LayerFactory.getLayerFromFile(data.filename);
    const finalSize = getFinalImageSize();
    await tempLayer.adjustLayerOpacity(data.layerOpacity);
    await tempLayer.resize(finalSize.height, finalSize.width);
    await layer.compositeLayerOver(tempLayer)
}


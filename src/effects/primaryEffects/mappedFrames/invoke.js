import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

import {mapNumberToRange} from "../../../core/math/mapNumberToRange.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {randomId} from "../../../core/math/random.js";

export const copyFile = async (filename, destinationFilename) => {
    return new Promise((resolve) => {
        fs.copyFile(filename, destinationFilename, () => {
            resolve();
        });
    });
}

const getAllFilesInDirectory = (dir) => {
    const list = [];

    fs.readdirSync(dir).forEach(file => {
        if (!file.startsWith('.') && !fs.lstatSync(dir + file).isDirectory()) {
            list.push(dir + file);
        }
    });

    return list;
}

const extractFrame = async (context) => {
    const frames = getAllFilesInDirectory(context.data.mappedFramesFolder)
    const index = Math.floor(mapNumberToRange(context.currentFrame, 0, context.numberOfFrames, 0, frames.length - 1));

    return copyFile(frames[index], context.filename);
}

export const mappedFrames = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        data: data,
        filename: GlobalSettings.getWorkingDirectory() + 'mapped-frame' + randomId() + '.png',

    }

    await extractFrame(context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.filename);

    await tempLayer.adjustLayerOpacity(data.layerOpacity);

    const finalSize = GlobalSettings.getFinalImageSize();
    await tempLayer.resize(finalSize.height, finalSize.width);
    await layer.compositeLayerOver(tempLayer);

    fs.unlinkSync(context.filename);
}

import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import gifFrames from "gif-frames";
import {randomId} from "../../../../core/math/random.js";
import {mapNumberToRange} from "../../../../core/math/mapNumberToRange.js";
import fs from "fs";

const extractFrame = async (context) => {
    return new Promise((resolve) => {
        gifFrames({
            url: context.data.imageOverlay,
            frames: 'all',
            outputType: 'png',
            cumulative: true
        }).then(function (frameData) {
            const index = Math.floor(mapNumberToRange(context.currentFrame, 0, context.numberOfFrames, 0, frameData.length - 1));
            const stream = frameData[index]
                .getImage()
                .pipe(fs.createWriteStream(context.fileName));

            stream.on('finish', function () {
                resolve();
            });
        });
    })
}

export const animatedImageOverlay = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        data: data,
        fileName: getWorkingDirectory() + 'animated-overlay-frame' + randomId() + '.png',
    }

    await extractFrame(context);

    let tempLayer = await LayerFactory.getLayerFromFile(context.fileName);
    const finalSize = getFinalImageSize();
    await tempLayer.resize(finalSize.height, finalSize.width);
    await layer.compositeLayerOver(tempLayer);

    fs.unlinkSync(context.fileName);
}

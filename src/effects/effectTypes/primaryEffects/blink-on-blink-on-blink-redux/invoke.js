import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import {findValue} from "../../../../core/math/findValue.js";
import fs from "fs";


export const glowAnimated = async (layer, data, currentFrame, totalFrames, index) => {
    const filename = getWorkingDirectory() + 'glow-blink' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const hue = findValue(data.blinkArray[index].glowLowerRange, data.blinkArray[index].glowUpperRange, data.blinkArray[index].glowTimes, totalFrames, currentFrame)
    await jimpImage.color([{apply: 'hue', params: [hue]}]);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

export const blinkOnOverlay = async (layer, data, currentFrame, totalFrames) => {

    const finalImageSize = getFinalImageSize();

    for (let i = 0; i < data.blinkArray.length; i++) {
        const blink = data.blinkArray[i];
        const tempLayer = await LayerFactory.getLayerFromFile(data.blinkFile);

        await tempLayer.resize(blink.diameter, blink.diameter);

        const fullSizedLayer = await LayerFactory.getNewLayer(finalImageSize.height * 2, finalImageSize.width * 2, '#00000000');
        await fullSizedLayer.compositeLayerOver(tempLayer, false);

        await fullSizedLayer.rotate(blink.rotationSpeedRange * (blink.counterClockwise ? -1 : 1));

        await fullSizedLayer.resize(finalImageSize.height, finalImageSize.width);

        const filename = getWorkingDirectory() + 'blink-final' + randomId() + '.png';

        await fullSizedLayer.toFile(filename);

        const finalLayer = await LayerFactory.getLayerFromFile(filename);

        await finalLayer.adjustLayerOpacity(data.layerOpacity);

        await glowAnimated(finalLayer, data, currentFrame, totalFrames, i);
        await layer.compositeLayerOver(finalLayer);

        fs.unlinkSync(filename)
    }

}

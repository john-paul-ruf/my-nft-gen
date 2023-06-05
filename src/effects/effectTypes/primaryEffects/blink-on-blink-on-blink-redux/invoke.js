import {LayerFactory} from "../../../../core/factory/layer/LayerFactory.js";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import {findValue} from "../../../../core/math/findValue.js";
import fs from "fs";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";

const randomize = async (layer, data, index) => {
    const filename = getWorkingDirectory() + 'randomize-blink' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    await jimpImage.color(data.blinkArray[index].randomize);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

const glowAnimated = async (layer, data, currentFrame, totalFrames, index) => {
    const filename = getWorkingDirectory() + 'glow-blink' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const hue = findValue(data.blinkArray[index].glowLowerRange, data.blinkArray[index].glowUpperRange, data.blinkArray[index].glowTimes, totalFrames, currentFrame)
    await jimpImage.color([{apply: 'hue', params: [hue]}]);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

const blinkinate = async (data, currentFrame, totalFrames, index) => {
    const scale = 1.1;
    const finalImageSize = getFinalImageSize();
    const blink = data.blinkArray[index];
    const fileName = getWorkingDirectory() + 'blink-in-action' + randomId() + '.png';
    const tempLayer = await LayerFactory.getLayerFromFile(data.blinkFile);
    await tempLayer.resize(blink.diameter, blink.diameter);

    const fullSizedLayer = await LayerFactory.getNewLayer(finalImageSize.longestSide * scale, finalImageSize.longestSide * scale, '#00000000');
    await fullSizedLayer.compositeLayerOver(tempLayer, false);

    await fullSizedLayer.toFile(fileName);

    const jimpImage = await Jimp.read(fileName);

    const rotateGaston = findOneWayValue(0, 360 * blink.rotationSpeedRange, totalFrames, currentFrame, blink.counterClockwise === 1);

    await jimpImage.rotate(data.blinkArray[index].initialRotation, false);
    await jimpImage.rotate(rotateGaston, false);

    await jimpImage.writeAsync(fileName);

    await fullSizedLayer.fromFile(fileName);

    await randomize(fullSizedLayer, data, index);
    await glowAnimated(fullSizedLayer, data, currentFrame, totalFrames, index);

    const top = Math.ceil(((finalImageSize.longestSide * scale) - finalImageSize.height) / 2);
    const left = Math.ceil(((finalImageSize.longestSide * scale) - finalImageSize.width) / 2);
    await fullSizedLayer.crop(left, top, finalImageSize.width, finalImageSize.height);

    await fullSizedLayer.toFile(fileName);

    return fileName;
}

export const blinkOnOverlay = async (layer, data, currentFrame, totalFrames) => {

    const filenames = [];

    for (let i = 0; i < data.blinkArray.length; i++) {
        filenames.push(await blinkinate(data, currentFrame, totalFrames, i));
    }

    for (let file of filenames) {
        await layer.compositeLayerOver(await LayerFactory.getLayerFromFile(file));
    }

    await layer.adjustLayerOpacity(data.layerOpacity);

    for (let file of filenames) {
        fs.unlinkSync(file)
    }
}

import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";

export const glitchDrumrollHorizontalWave = async (layer, data) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/drumrollHorizontalWave.js
    /////////////////////
    // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine

    const finalImageSize = getFinalImageSize();
    const filename = getWorkingDirectory() + 'glitch-drumroll' + randomId() + '.png';

    await layer.toFile(filename)

    const jimpImage = await Jimp.read(filename);

    const imgData = jimpImage.bitmap.data;

    let roll = 0;

    const theGlitch = getRandomIntInclusive(0, 100);
    if (theGlitch < data.glitchChance) {
        for (let x = 0; x < finalImageSize.width; x++) {
            if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (finalImageSize.height * 2));
            if (Math.random() > 0.98) roll = 0;

            for (let y = 0; y < finalImageSize.height; y++) {
                let idx = (x + y * finalImageSize.width) * 4;

                let x2 = x + roll;
                if (x2 > finalImageSize.width - 1) x2 -= finalImageSize.width;
                let idx2 = (x2 + y * finalImageSize.width) * 4;

                for (let c = 0; c < 4; c++) {
                    imgData[idx2 + c] = imgData[idx + c];
                }
            }
        }
    }

    jimpImage.bitmap.data = Buffer.from(imgData);
    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";

export const glitchInverse = async (layer) => {

    const filename = getWorkingDirectory() + 'glitch-inverse' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/inverse.js
    /////////////////////
    const imgData = new Uint32Array(jimpImage.bitmap.data);
    for (let i = 0; i < imgData.length; i++) {
        imgData[i] = ~imgData[i] | 0xFF000000;
    }
    jimpImage.bitmap.data = Buffer.from(imgData);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

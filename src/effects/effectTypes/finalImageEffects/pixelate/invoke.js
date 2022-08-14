import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import {findValue} from "../../../../core/math/findValue.js";
import fs from "fs";

export const pixelate = async (layer, data, currentFrame, totalFrames) => {
    const filename = getWorkingDirectory() + 'pixelate' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const pixelateGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));

    if (pixelateGaston > 0) {
        await jimpImage.pixelate(pixelateGaston);
    }

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

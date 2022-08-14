import {getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {randomId} from "../../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";

export const sepia = async (layer) => {
    const filename = getWorkingDirectory() + 'sepia' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    await jimpImage.sepia();

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}
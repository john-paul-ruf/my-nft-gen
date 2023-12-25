
import {randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";

export const randomize = async (layer, data) => {
    const filename = GlobalSettings.getWorkingDirectory() + 'randomize' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    await jimpImage.color(data.randomize);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

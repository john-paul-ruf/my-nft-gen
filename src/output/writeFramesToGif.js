import Jimp from "jimp";
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import fs from "fs";
import {writeToMp4} from "./writeToMp4.js";

export const writeFramesToGif = async (frameFilenames, config) => {
    const frames = []

    for(let f = 0; f < frameFilenames.length; f++){
        const frame = await Jimp.read(frameFilenames[f]);
        //Apply color depth to composited image
        GifUtil.quantizeDekker(frame, config.colorDepth)

        //Jimp to gif the frame then toss the frame into our in memory array of frames
        frames.push(new GifFrame(new BitmapImage(frame.bitmap)));

        fs.unlinkSync(frameFilenames[f]);
    }

    const writeGif = async () => {
        return new Promise((resolve, reject) => {
            GifUtil.write(config.fileOut + '.gif', frames).then(gif => {
                console.log("gif written");
                resolve();
            });
        });
    }

    await writeGif();
}
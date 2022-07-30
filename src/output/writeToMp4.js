import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import {IMAGESIZE} from "../logic/gobals.js";
import {writeFramesToGif} from "./writeFramesToGif.js";

export const writeToMp4 = async (frameFilenames, config) => {


    await writeFramesToGif(frameFilenames)

    const maker = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path)

    const writeMp4 = async () => {
        return new Promise((resolve, reject) => {
            maker
                .size(IMAGESIZE.toString() + 'x' + IMAGESIZE.toString())
                .input(config.fileOut + '.gif')
                .outputOptions('-pix_fmt yuv420p')
                .output(config.fileOut + '.mp4')
                .noAudio()
                .on("end", () => {
                    resolve();
                    console.log("mp4 Finished");
                })
                .on("error", (e) => console.log(e))
                .run();
        });
    }

    await writeMp4();
}
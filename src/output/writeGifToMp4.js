import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import {IMAGESIZE} from "../logic/gobals.js";

export const writeGifToMp4 = async (config) => {
    const maker = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path)

    const writeMp4 = async () => {
        new Promise((resolve, reject) => {
            maker
                .size(IMAGESIZE.toString() + 'x' + IMAGESIZE.toString())
                .input(config.fileOut + '.gif')
                .outputOptions('-pix_fmt yuv420p')
                .output(config.fileOut + '.mp4')
                .noAudio()
                .on("end", () => {
                    console.log("mp4 Finished");
                })
                .on("error", (e) => console.log(e))
                .run();
        });
    }

    await writeMp4();
}
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

export const writeToMp4 = async (fileSelector, config) => {


    const writeMp4 = async () => {
        return new Promise((resolve, reject) => {

            const video = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);

            video.addInput(fileSelector)
                .outputFormat('mp4')
                .videoCodec('libx265')
                .outputOptions(['-crf 28', '-preset veryslow', '-tune zerolatency', '-an'])
                .on("end", () => {
                    resolve();
                    console.log("mp4 Finished");
                })
                .on('progress', (progress) => {
                    console.log(progress);
                })
                .on("error", (e) => {
                    reject();
                    console.log(e)
                })
                .mergeToFile(config.fileOut + '.mp4');

        });
    }

    await writeMp4();
}
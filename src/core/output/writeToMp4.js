import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

export const writeToMp4 = async (fileSelector, config) => {


    const writeMp4 = async () => {
        return new Promise((resolve, reject) => {

            const pass1 = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);
            const pass2 = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);

            pass1.addInput(fileSelector)
                .outputFormat('mp4')
                .videoCodec('libx264')
                .withFpsInput(30)
                .outputOptions([
                    '-preset veryslow', //take time to compress
                    '-crf 28',  //compression rate*/
                    '-pix_fmt yuv420p', //quicktime apple compatibility
                    '-an' //no audio
                ])
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
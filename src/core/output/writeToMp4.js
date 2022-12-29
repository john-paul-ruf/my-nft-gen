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
                    '-pix_fmt yuv420p', //quicktime apple compatibility
                    '-an', //no audio
                    //https://superuser.com/questions/866798/what-ffmpeg-command-line-matches-the-one-youtube-uses
                    '-movflags +faststart',
                    '-profile:v high',
                    '-level 4.0',
                    '-bf 2',
                    '-g 15',
                    '-coder 1',
                    '-r 24000/1001',
                    '-aspect 16:9',
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
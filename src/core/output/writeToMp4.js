import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
import {getWorkingDirectory} from "../GlobalSettings.js";

export const writeToMp4 = async (fileSelector, config) => {


    const writeMp4 = async () => {
        return new Promise((resolve, reject) => {

            const pass1 = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);
            const pass2 = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);

            pass1.addInput(fileSelector)
                .outputFormat('mp4')
                .videoCodec('libx265')
                .outputOptions([
                    '-tag:v hvc1', //compatibility
                    '-preset veryslow', //take time to compress
                    '-crf 32',  //compression rate
                    /*'-profile:v high',*/
                    '-level:v 4.0',
                    '-pix_fmt yuv420p', //quicktime apple compatibility
                    '-color_primaries 1',
                    '-color_trc 1',
                    '-colorspace 1',
                    '-pass 1',
                    '-passlogfile ' + getWorkingDirectory(),
                    '-an' //no audio
                ])
                .on("end", () => {

                    pass2.addInput(fileSelector)
                        .outputFormat('mp4')
                        .videoCodec('libx265')
                        .outputOptions([
                            '-tag:v hvc1', //compatibility
                            '-preset veryslow', //take time to compress
                            '-crf 32',  //compression rate
                            /*'-profile:v high',*/
                            '-level:v 4.0',
                            '-pix_fmt yuv420p', //quicktime apple compatibility
                            '-color_primaries 1',
                            '-color_trc 1',
                            '-colorspace 1',
                            '-pass 2',
                            '-passlogfile ' + getWorkingDirectory(),
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
                })
                .on('progress', (progress) => {
                    console.log(progress);
                })
                .on("error", (e) => {
                    reject();
                    console.log(e)
                })
                .mergeToFile('/dev/null');

        });
    }

    await writeMp4();
}
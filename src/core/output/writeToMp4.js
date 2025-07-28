import pathToFfmpeg from 'ffmpeg-ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';

export const writeToMp4 = async (fileSelector, config) => {
    const writeMp4 = async () => new Promise((resolve, reject) => {

        const pass1 = ffmpeg(fileSelector).setFfprobePath(pathToFfmpeg.ffprobePath).setFfmpegPath(pathToFfmpeg.ffmpegPath);

        pass1.outputFormat('mp4')
            .videoCodec('libx265')
            .withFpsInput(30)
            .outputOptions([
                '-threads 4',
                '-tag:v hvc1', // compatibility
                '-preset veryslow', // take time to compress
                '-pix_fmt yuv420p', // quicktime apple compatibility
                '-crf 20', // compression
                '-tune zerolatency',
                '-movflags +faststart',
                '-an', // no audio
            ])
            .on('end', () => {
                resolve();
                console.log('mp4 Finished');
            })
            .on('progress', (progress) => {
                console.log(`${config.finalFileName} - rendering mp4 - ${progress.frames}`);
            })
            .on('error', (e) => {
                reject(new Error('Error rendering'));
                console.log(e);
            })
            .mergeToFile(`${config.fileOut}.mp4`);
    });

    await writeMp4();
};

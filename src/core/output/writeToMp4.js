import ffmpeg from 'fluent-ffmpeg';
import ffmpeg_static from 'ffmpeg-static';
import ffprobe_static from 'ffprobe-static';

export const writeToMp4 = async (fileSelector, config) => {
    const writeMp4 = async () => new Promise((resolve, reject) => {

        const pass1 = ffmpeg(fileSelector).setFfprobePath(ffprobe_static.path).setFfmpegPath(ffmpeg_static);

        pass1.outputFormat('mp4')
            .videoCodec('libx265')
            .withFpsInput(120)
            .outputOptions([
                '-tag:v hvc1', // compatibility
                '-preset veryslow', // take time to compress
                '-pix_fmt yuv420p', // quicktime apple compatibility
                '-crf 28', // compression
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

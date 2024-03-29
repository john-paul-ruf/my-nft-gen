import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

export const writeToMp4 = async (fileSelector, config) => {
  const writeMp4 = async () => new Promise((resolve, reject) => {
    const pass1 = ffmpeg().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path);

    pass1.addInput(fileSelector)
      .outputFormat('mp4')
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

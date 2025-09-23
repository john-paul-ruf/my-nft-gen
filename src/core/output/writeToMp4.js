import pathToFfmpeg from 'ffmpeg-ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import { WorkerEvents } from '../events/WorkerEventCategories.js';

export const writeToMp4 = async (fileSelector, config, eventEmitter = null) => {
    const writeMp4 = async () => new Promise((resolve, reject) => {

        const pass1 = ffmpeg(fileSelector).setFfprobePath(pathToFfmpeg.ffprobePath).setFfmpegPath(pathToFfmpeg.ffmpegPath);

        // Emit render started event
        if (eventEmitter) {
            eventEmitter.emit(WorkerEvents.MP4_RENDER_STARTED, {
                fileSelector,
                outputFile: `${config.fileOut}.mp4`,
                timestamp: Date.now()
            });
        }

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
                // Emit render completed event
                if (eventEmitter) {
                    eventEmitter.emit(WorkerEvents.MP4_RENDER_COMPLETED, {
                        outputFile: `${config.fileOut}.mp4`,
                        timestamp: Date.now()
                    });
                }
                // mp4 Finished
                resolve();
            })
            .on('progress', (progress) => {
                // ${config.finalFileName} - rendering mp4 - ${progress.frames}
                // Emit render progress event
                if (eventEmitter) {
                    eventEmitter.emit(WorkerEvents.MP4_RENDER_PROGRESS, {
                        frames: progress.frames,
                        currentFps: progress.currentFps,
                        currentKbps: progress.currentKbps,
                        targetSize: progress.targetSize,
                        timemark: progress.timemark,
                        percent: progress.percent,
                        timestamp: Date.now()
                    });
                }
            })
            .on('error', (e) => {
                // Emit render failed event
                if (eventEmitter) {
                    eventEmitter.emit(WorkerEvents.MP4_RENDER_FAILED, {
                        error: e.message,
                        outputFile: `${config.fileOut}.mp4`,
                        timestamp: Date.now()
                    });
                }
                // Error during MP4 render
                reject(new Error('Error rendering'));
            })
            .mergeToFile(`${config.fileOut}.mp4`);
    });

    await writeMp4();
};

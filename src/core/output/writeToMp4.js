import ffmpeg from 'fluent-ffmpeg';
import { WorkerEvents } from '../events/WorkerEventCategories.js';
import { FFmpegConfig } from '../config/FFmpegConfig.js';

/**
 * Write frames to MP4 video file
 * 
 * @param {string} fileSelector - Pattern for input frame files (e.g., "frame-%d.png")
 * @param {Object} config - Configuration object with fileOut property
 * @param {Object} eventEmitter - Optional event emitter for progress tracking
 * @param {FFmpegConfig} ffmpegConfig - FFmpeg configuration (paths to binaries)
 * @returns {Promise<void>}
 * 
 * Follows Dependency Inversion Principle:
 * - Depends on FFmpegConfig abstraction, not concrete ffmpeg-ffprobe-static
 * - Allows injection of custom ffmpeg paths for testing and flexibility
 */
export const writeToMp4 = async (fileSelector, config, eventEmitter = null, ffmpegConfig = null) => {
    // If no config provided, use default (ffmpeg-ffprobe-static)
    const ffmpegPaths = ffmpegConfig || await FFmpegConfig.createDefault();
    
    const writeMp4 = async () => new Promise((resolve, reject) => {

        const pass1 = ffmpeg(fileSelector)
            .setFfprobePath(ffmpegPaths.getFfprobePath())
            .setFfmpegPath(ffmpegPaths.getFfmpegPath());

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

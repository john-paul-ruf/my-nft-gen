import fs from 'fs';
import { ComposeInfo } from '../utils/composeInfo.js';
import { timeLeft } from '../utils/timeLeft.js';
import { writeArtistCard } from '../output/writeArtistCard.js';
import { writeToMp4 } from '../output/writeToMp4.js';
import { writeScreenCap } from '../output/writeScreenCap.js';
import { LayerFactory } from '../factory/layer/LayerFactory.js';
import {RequestNewFrameBuilderThread} from "../worker-threads/RequestNewFrameBuilderThread.js";
import {globalBufferPool} from '../pool/BufferPool.js';

export class LoopBuilder {
    constructor(settings, eventEmitter = null) {
        this.settings = settings;
        this.finalFileName = settings.config.finalFileName;
        this.config = settings.config;
        this.eventEmitter = eventEmitter;

        this.context = {
            numberOfFrame: this.config.numberOfFrame,
            finalImageSize: settings.finalSize,
            workingDirectory: settings.workingDirectory,
            layerStrategy: settings.fileConfig.layerStrategy,
            frameFilenames: [], // will be a collection of png images filenames that in the end gets converted to a MP4
            finalFileName: this.config.finalFileName,
        };
    }



    async constructLoop(keepFrames = true) {
        const checkFileExists = async (filepath) => new Promise((resolve, reject) => {
            fs.access(filepath, fs.constants.F_OK, (error) => {
                resolve(!error);
            });
        });

        return new Promise(async (resolve) => {
            this.config.startTime = new Date();

            this.composeInfo = new ComposeInfo({
                config: this.config,
                effects: this.settings.effects,
                finalImageEffects: this.settings.finalImageEffects,
                settings: this.settings,
            });

            // Composition info - handled by structured events now

            const maxConcurrentCalls = this.settings.maxConcurrentFrameBuilderThreads; // Maximum number of concurrent calls
            const callQueue = []; // Array to track ongoing promises

            for (let f = this.settings.frameStart; f < this.config.numberOfFrame; f += this.config.frameInc) {
                const framePath = `${this.context.workingDirectory + this.context.finalFileName}-frame-${f.toString()}.png`;

                this.context.frameFilenames.push(framePath);

                // Skip already existing frames
                if (await checkFileExists(framePath)) {
                    this.context.frameFilenames.push(framePath);
                    continue;
                }

                // Wait until there's room for a new task
                while (callQueue.length >= maxConcurrentCalls) {
                    await Promise.race(callQueue); // Wait for any ongoing task to finish
                }

                const startTime = new Date();

                // Create and track the new task
                const task = RequestNewFrameBuilderThread(
                    `${this.settings.config.configFileOut}-settings.json`,
                    f,
                    this.eventEmitter,
                    { suppressWorkerLogs: false }
                )
                    .then(() => {
                        // Frame completion - handled by structured events now
                    })
                    .catch(err => {
                        this.eventEmitter.emitWorkerError(err, {
                            frameNumber: f,
                            context: 'frame_processing'
                        });
                    })
                    .finally(() => {
                        // Remove the completed task from the queue
                        const taskIndex = callQueue.indexOf(task);
                        if (taskIndex !== -1) callQueue.splice(taskIndex, 1);
                    });

                callQueue.push(task); // Add the task to the queue
            }

            // Wait for all remaining tasks to complete before exiting
            await Promise.all(callQueue);
            // All frames processed - handled by structured events now

            // Pool statistics - handled by structured events now

            /// /////////////////////
            // WRITE TO FILE
            /// /////////////////////
            await writeArtistCard(this.config, this.composeInfo);
            await writeToMp4(`${this.context.workingDirectory + this.config.finalFileName}-frame-%d.png`, this.config, this.eventEmitter);
            await writeScreenCap(this.context.frameFilenames[0], this.config);

            if(!keepFrames) {
                for (let f = 0; f < this.context.frameFilenames.length; f++) {
                    // delete files
                    await fs.unlinkSync(this.context.frameFilenames[f]);
                }
            }

            resolve();
        });
    }

    async constructPreview(frameNumber) {
        return new Promise(async (resolve) => {
            this.config.startTime = new Date();
            this.context.backgroundColor = await this.settings.getBackgroundFromBucket();

            this.composeInfo = new ComposeInfo({
                config: this.config,
                effects: this.settings.effects,
                finalImageEffects: this.settings.finalImageEffects,
                settings: this.settings,
            });

            // Composition info - handled by structured events now

            /// /////////////////////
            // ANIMATE - start here
            // Outer most layer of the function
            // Here we create all the frames in order
            /// /////////////////////
            for (let f = 0; f < 1; f += this.config.frameInc) {
                const startTime = new Date();
                await RequestNewFrameBuilderThread(
                    `${this.settings.config.configFileOut}-settings.json`,
                    frameNumber,
                    this.eventEmitter,
                    { suppressWorkerLogs: false }
                );
                this.context.frameFilenames.push(`${this.context.workingDirectory + this.context.finalFileName}-frame-${frameNumber.toString()}.png`);
                // Frame progress - handled by structured events now
            }

            /// /////////////////////
            // WRITE TO FILE
            /// /////////////////////
            await writeScreenCap(this.context.frameFilenames[0], this.config);

            for (let f = 0; f < this.context.frameFilenames.length; f++) {
                // delete files
                await fs.unlink(this.context.frameFilenames[f]);
            }

            resolve(this.settings);
        });
    }
}

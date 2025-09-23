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

        // Termination control
        this.shouldTerminate = false;
        this.isTerminating = false;
        this.activeFrameBuilders = new Map(); // Track active frame builder processes
        this.terminationReason = null;

        this.context = {
            numberOfFrame: this.config.numberOfFrame,
            finalImageSize: settings.finalSize,
            workingDirectory: settings.workingDirectory,
            layerStrategy: settings.fileConfig.layerStrategy,
            frameFilenames: [], // will be a collection of png images filenames that in the end gets converted to a MP4
            finalFileName: this.config.finalFileName,
        };
    }

    /**
     * Request termination of the loop generation
     */
    requestStop(reason = 'user_requested') {
        if (this.isTerminating) {
            return; // Already terminating
        }

        console.log(`🛑 LoopBuilder: Termination requested (reason: ${reason})`);
        
        this.shouldTerminate = true;
        this.terminationReason = reason;
        this.isTerminating = true;

        // Emit termination event
        if (this.eventEmitter) {
            this.eventEmitter.emit('LOOP_TERMINATION_REQUESTED', {
                reason,
                timestamp: Date.now(),
                activeFrameBuilders: this.activeFrameBuilders.size
            });
        }

        // Terminate all active frame builders
        this._terminateActiveFrameBuilders();
    }

    /**
     * Check if termination was requested
     */
    isTerminationRequested() {
        return this.shouldTerminate;
    }

    /**
     * Private method to terminate all active frame builders
     */
    _terminateActiveFrameBuilders() {
        console.log(`🛑 LoopBuilder: Terminating ${this.activeFrameBuilders.size} active frame builders`);
        
        this.activeFrameBuilders.forEach((frameBuilder, frameNumber) => {
            try {
                const { childProcess, workerId } = frameBuilder;
                
                if (childProcess && childProcess.kill) {
                    childProcess.kill('SIGTERM');
                    console.log(`🛑 LoopBuilder: Terminated frame builder for frame ${frameNumber} (worker: ${workerId})`);
                }
            } catch (error) {
                console.error(`🛑 LoopBuilder: Error terminating frame builder for frame ${frameNumber}:`, error);
            }
        });

        this.activeFrameBuilders.clear();
    }



    async constructLoop(keepFrames = true) {
        const checkFileExists = async (filepath) => new Promise((resolve, reject) => {
            fs.access(filepath, fs.constants.F_OK, (error) => {
                resolve(!error);
            });
        });

        return new Promise(async (resolve, reject) => {
            try {
                this.config.startTime = new Date();

                // Check for early termination
                if (this.shouldTerminate) {
                    this._handleTermination(resolve, 'terminated_before_start');
                    return;
                }

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
                    // Check for termination before each frame
                    if (this.shouldTerminate) {
                        console.log(`🛑 LoopBuilder: Termination detected at frame ${f}, stopping loop generation`);
                        
                        // Wait for current tasks to complete or timeout
                        await this._waitForTasksOrTimeout(callQueue, 5000);
                        
                        this._handleTermination(resolve, 'terminated_during_frame_loop');
                        return;
                    }

                    const framePath = `${this.context.workingDirectory + this.context.finalFileName}-frame-${f.toString()}.png`;

                    this.context.frameFilenames.push(framePath);

                    // Skip already existing frames
                    if (await checkFileExists(framePath)) {
                        this.context.frameFilenames.push(framePath);
                        continue;
                    }

                    // Wait until there's room for a new task
                    while (callQueue.length >= maxConcurrentCalls && !this.shouldTerminate) {
                        await Promise.race(callQueue); // Wait for any ongoing task to finish
                    }

                    // Check again after waiting
                    if (this.shouldTerminate) {
                        console.log(`🛑 LoopBuilder: Termination detected while waiting for task slots`);
                        await this._waitForTasksOrTimeout(callQueue, 5000);
                        this._handleTermination(resolve, 'terminated_while_waiting');
                        return;
                    }

                    const startTime = new Date();

                    // Create and track the new task
                    const task = this._createFrameBuilderTask(f, callQueue);
                    callQueue.push(task); // Add the task to the queue
                }

                // Check for termination before final processing
                if (this.shouldTerminate) {
                    console.log(`🛑 LoopBuilder: Termination detected before final processing`);
                    await this._waitForTasksOrTimeout(callQueue, 5000);
                    this._handleTermination(resolve, 'terminated_before_final_processing');
                    return;
                }

                // Wait for all remaining tasks to complete before exiting
                await Promise.all(callQueue);
                
                // Final termination check
                if (this.shouldTerminate) {
                    this._handleTermination(resolve, 'terminated_after_frames_completed');
                    return;
                }

                // All frames processed - handled by structured events now

                // Pool statistics - handled by structured events now

                /// /////////////////////
                // WRITE TO FILE
                /// /////////////////////
                await writeArtistCard(this.config, this.composeInfo);
                
                if (this.shouldTerminate) {
                    this._handleTermination(resolve, 'terminated_after_artist_card');
                    return;
                }
                
                await writeToMp4(`${this.context.workingDirectory + this.config.finalFileName}-frame-%d.png`, this.config, this.eventEmitter);
                
                if (this.shouldTerminate) {
                    this._handleTermination(resolve, 'terminated_after_mp4');
                    return;
                }
                
                await writeScreenCap(this.context.frameFilenames[0], this.config);

                if(!keepFrames) {
                    for (let f = 0; f < this.context.frameFilenames.length; f++) {
                        // delete files
                        await fs.unlinkSync(this.context.frameFilenames[f]);
                    }
                }

                // Successful completion
                if (this.eventEmitter) {
                    this.eventEmitter.emit('LOOP_COMPLETED', {
                        totalFrames: this.config.numberOfFrame,
                        timestamp: Date.now(),
                        duration: Date.now() - this.config.startTime
                    });
                }

                resolve();
            } catch (error) {
                // Handle errors during termination
                if (this.shouldTerminate) {
                    this._handleTermination(resolve, 'terminated_due_to_error', error);
                } else {
                    reject(error);
                }
            }
        });
    }

    /**
     * Create a frame builder task with termination handling
     */
    _createFrameBuilderTask(frameNumber, callQueue) {
        const task = RequestNewFrameBuilderThread(
            `${this.settings.config.configFileOut}-settings.json`,
            frameNumber,
            this.eventEmitter,
            { suppressWorkerLogs: false }
        )
            .then(() => {
                // Frame completion - handled by structured events now
                this.activeFrameBuilders.delete(frameNumber);
            })
            .catch(err => {
                console.error(`Error processing frame ${frameNumber}:`, err);
                this.activeFrameBuilders.delete(frameNumber);
                
                // If this error occurred due to termination, don't treat it as a real error
                if (!this.shouldTerminate) {
                    throw err;
                }
            })
            .finally(() => {
                // Remove the completed task from the queue
                const taskIndex = callQueue.indexOf(task);
                if (taskIndex !== -1) callQueue.splice(taskIndex, 1);
                this.activeFrameBuilders.delete(frameNumber);
            });

        // Track the child process for potential termination
        // The task now has childProcess and workerId properties
        this.activeFrameBuilders.set(frameNumber, {
            task,
            childProcess: task.childProcess,
            workerId: task.workerId,
            frameNumber
        });

        return task;
    }

    /**
     * Wait for tasks to complete or timeout
     */
    async _waitForTasksOrTimeout(callQueue, timeoutMs) {
        if (callQueue.length === 0) return;

        console.log(`🛑 LoopBuilder: Waiting for ${callQueue.length} tasks to complete (timeout: ${timeoutMs}ms)`);
        
        try {
            await Promise.race([
                Promise.all(callQueue),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
                )
            ]);
        } catch (error) {
            console.log(`🛑 LoopBuilder: Tasks did not complete within timeout, proceeding with termination`);
        }
    }

    /**
     * Handle termination cleanup and resolution
     */
    _handleTermination(resolve, stage, error = null) {
        console.log(`🛑 LoopBuilder: Handling termination at stage: ${stage}`);
        
        if (this.eventEmitter) {
            this.eventEmitter.emit('LOOP_TERMINATED', {
                reason: this.terminationReason,
                stage,
                timestamp: Date.now(),
                error: error ? error.message : null,
                completedFrames: this.context.frameFilenames.length
            });
        }

        // Clean up any remaining active frame builders
        this._terminateActiveFrameBuilders();

        resolve({
            terminated: true,
            reason: this.terminationReason,
            stage,
            completedFrames: this.context.frameFilenames.length
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

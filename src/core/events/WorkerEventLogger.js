import { WorkerEvents } from './WorkerEventCategories.js';
import { EventEmitter } from 'events';

/**
 * Worker Event Logger - handles formatting and logging of worker events
 * Single responsibility: Format and display worker thread events consistently
 */
export class WorkerEventLogger {
    constructor(options = {}) {
        this.options = {
            showFrames: true,
            showEffects: true,
            showFileIO: true,
            showPerformance: true,
            showLifecycle: true,
            showErrors: true,
            verbose: false,
            ...options
        };

        // Track timing for estimates
        this.frameTimings = [];
        this.projectStartTime = null;
    }

    /**
     * Attach event listeners to an EventEmitter
     * @param {EventEmitter} eventEmitter - The event emitter to listen to
     */
    attachTo(eventEmitter) {
        if (!eventEmitter || typeof eventEmitter.on !== 'function') {
            throw new Error('WorkerEventLogger requires an EventEmitter instance');
        }

        // Frame events
        if (this.options.showFrames) {
            eventEmitter.on(WorkerEvents.FRAME_STARTED, (data) => this._handleFrameStarted(data));
            eventEmitter.on(WorkerEvents.FRAME_COMPLETED, (data) => this._handleFrameCompleted(data));
            eventEmitter.on(WorkerEvents.FRAME_FAILED, (data) => this._handleFrameFailed(data));
        }

        // Effect events
        if (this.options.showEffects) {
            eventEmitter.on(WorkerEvents.EFFECT_STARTED, (data) => this._handleEffectStarted(data));
            eventEmitter.on(WorkerEvents.EFFECT_COMPLETED, (data) => this._handleEffectCompleted(data));
        }

        // File I/O events
        if (this.options.showFileIO) {
            eventEmitter.on(WorkerEvents.FILE_WRITE_COMPLETED, (data) => this._handleFileWriteCompleted(data));
        }

        // Performance events
        if (this.options.showPerformance) {
            eventEmitter.on(WorkerEvents.TIMING_FRAME, (data) => this._handleTimingFrame(data));
            eventEmitter.on(WorkerEvents.MEMORY_USAGE, (data) => this._handleMemoryUsage(data));
        }

        // Lifecycle events
        if (this.options.showLifecycle) {
            eventEmitter.on(WorkerEvents.WORKER_STARTED, (data) => this._handleWorkerStarted(data));
            eventEmitter.on(WorkerEvents.WORKER_COMPLETED, (data) => this._handleWorkerCompleted(data));
        }

        // Error events (always enabled)
        if (this.options.showErrors) {
            eventEmitter.on(WorkerEvents.WORKER_ERROR, (data) => this._handleWorkerError(data));
            eventEmitter.on(WorkerEvents.WORKER_WARNING, (data) => this._handleWorkerWarning(data));
            eventEmitter.on(WorkerEvents.FATAL_ERROR, (data) => this._handleFatalError(data));
        }
    }

    // Private event handlers
    _handleWorkerStarted(data) {
        console.log(`🚀 Worker thread started`);
        this.projectStartTime = Date.now();
        this.frameTimings = [];
    }

    _handleFrameStarted(data) {
        const progress = data.totalFrames ? `(${data.frameNumber + 1}/${data.totalFrames})` : '';
        const progressPercent = data.progress ? ` - ${Math.round(data.progress * 100)}%` : '';
        console.log(`🎬 Starting frame ${data.frameNumber} ${progress}${progressPercent}`);
    }

    _handleFrameCompleted(data) {
        // Track frame timing for estimates
        if (data.durationMs) {
            this.frameTimings.push(data.durationMs);
        }

        const progress = data.totalFrames ? `(${data.frameNumber + 1}/${data.totalFrames})` : '';
        const progressPercent = data.progress ? ` - ${Math.round(data.progress * 100)}%` : '';
        const timing = data.durationMs ? ` in ${this._formatDuration(data.durationMs)}` : '';
        const outputInfo = data.outputPath ? ` → ${data.outputPath.split('/').pop()}` : '';

        // Calculate time estimate
        let estimateText = '';
        if (data.totalFrames && this.frameTimings.length > 0) {
            const averageFrameTime = this.frameTimings.reduce((a, b) => a + b, 0) / this.frameTimings.length;
            const estimate = this._estimateTimeToCompletion(data.frameNumber, data.totalFrames, averageFrameTime);
            estimateText = ` | ${estimate}`;
        }

        console.log(`✅ Completed frame ${data.frameNumber} ${progress}${progressPercent}${timing}${outputInfo}${estimateText}`);
    }

    _handleFrameFailed(data) {
        const progress = data.totalFrames ? `(${data.frameNumber + 1}/${data.totalFrames})` : '';
        console.error(`❌ Frame ${data.frameNumber} ${progress} failed: ${data.error}`);
    }

    _handleEffectStarted(data) {
        console.log(`🎨 Effect ${data.effectName} starting on frame ${data.frameNumber}`);
    }

    _handleEffectCompleted(data) {
        const timing = data.durationMs ? ` in ${this._formatDuration(data.durationMs)}` : '';
        console.log(`✨ Effect ${data.effectName} completed on frame ${data.frameNumber}${timing}`);
    }

    _handleFileWriteCompleted(data) {
        const sizeMB = data.fileSizeBytes ? Math.round(data.fileSizeBytes / 1024 / 1024 * 100) / 100 : 0;
        const timing = data.durationMs ? ` in ${this._formatDuration(data.durationMs)}` : '';
        const sizeInfo = sizeMB > 0 ? ` (${sizeMB}MB)` : '';
        console.log(`💾 File written for frame ${data.frameNumber}${sizeInfo}${timing}`);
    }

    _handleTimingFrame(data) {
        const frameTime = this._formatDuration(data.totalMs);
        const breakdowns = data.breakdowns || {};
        const breakdownText = Object.keys(breakdowns).length > 0
            ? ` (${Object.entries(breakdowns).map(([key, val]) => `${key}: ${this._formatDuration(val)}`).join(', ')})`
            : '';
        console.log(`⏱️ Frame ${data.frameNumber} timing: ${frameTime}${breakdownText}`);
    }

    _handleMemoryUsage(data) {
        const memMB = Math.round(data.heapUsed / 1024 / 1024);
        const memTotalMB = data.heapTotal ? Math.round(data.heapTotal / 1024 / 1024) : null;
        const externalMB = data.external ? Math.round(data.external / 1024 / 1024) : null;
        const frameInfo = data.frameNumber !== undefined ? ` for frame ${data.frameNumber}` : '';

        let memoryText = `💾 Memory usage${frameInfo}: ${memMB}MB`;
        if (memTotalMB) memoryText += ` / ${memTotalMB}MB heap`;
        if (externalMB) memoryText += `, ${externalMB}MB external`;

        console.log(memoryText);
    }

    _handleWorkerCompleted(data) {
        const totalTime = data.totalDurationMs ? this._formatDuration(data.totalDurationMs) : 'unknown time';
        console.log(`🎉 Worker completed in ${totalTime}`);
    }

    _handleWorkerError(data) {
        console.error(`❌ Worker error: ${data.error}`);
        if (this.options.verbose && data.stack) {
            console.error(`Stack trace: ${data.stack}`);
        }
    }

    _handleWorkerWarning(data) {
        console.warn(`⚠️ Worker warning: ${data.message || data.error}`);
    }

    _handleFatalError(data) {
        console.error(`💀 Fatal error: ${data.error}`);
        if (data.stack) {
            console.error(`Stack trace: ${data.stack}`);
        }
    }

    // Private utility methods
    _formatDuration(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    _estimateTimeToCompletion(currentFrame, totalFrames, averageFrameTime) {
        if (!averageFrameTime || currentFrame === 0) return 'calculating...';

        const framesRemaining = totalFrames - (currentFrame + 1);
        const estimatedRemainingMs = framesRemaining * averageFrameTime;
        const estimatedCompletionTime = new Date(Date.now() + estimatedRemainingMs);

        let durationText = '';
        if (estimatedRemainingMs < 60000) {
            durationText = `~${Math.round(estimatedRemainingMs / 1000)}s`;
        } else if (estimatedRemainingMs < 3600000) {
            const minutes = Math.round(estimatedRemainingMs / 60000);
            durationText = `~${minutes}m`;
        } else {
            const hours = Math.floor(estimatedRemainingMs / 3600000);
            const minutes = Math.round((estimatedRemainingMs % 3600000) / 60000);
            durationText = `~${hours}h ${minutes}m`;
        }

        const completionTimeString = estimatedCompletionTime.toLocaleString();
        return `${durationText} remaining (ETA: ${completionTimeString})`;
    }

    /**
     * Create a new EventEmitter with this logger attached (legacy)
     * @param {Object} options - Options for the logger
     * @returns {EventEmitter} EventEmitter with logger attached
     */
    static createWithLogger(options = {}) {
        const eventEmitter = new EventEmitter();
        const logger = new WorkerEventLogger(options);
        logger.attachTo(eventEmitter);
        return eventEmitter;
    }

    /**
     * Create a subscription to a UnifiedEventBus
     * @param {UnifiedEventBus} eventBus - The event bus to subscribe to
     * @param {Object} options - Logger options
     * @returns {Object} Object with logger instance and subscription IDs
     */
    static subscribeToEventBus(eventBus, options = {}) {
        const logger = new WorkerEventLogger(options);

        // Subscribe to all events and handle them through the logger
        const subscriptions = eventBus.subscribeToAllEvents((data) => {
            // Create a mock emitter to reuse existing logger event handlers
            const mockEmitter = {
                listeners: [],
                on(eventName, handler) {
                    this.listeners.push({ eventName, handler });
                },
                emit(eventName, eventData) {
                    this.listeners.forEach(listener => {
                        if (listener.eventName === eventName) {
                            listener.handler(eventData);
                        }
                    });
                }
            };

            // Attach logger and emit the event
            logger.attachTo(mockEmitter);
            mockEmitter.emit(data.eventName, data);
        });

        return { logger, subscriptions };
    }

    /**
     * Subscribe to specific categories on a UnifiedEventBus
     * @param {UnifiedEventBus} eventBus - The event bus to subscribe to
     * @param {Array} categories - Array of categories to subscribe to
     * @param {Object} options - Logger options
     * @returns {Object} Object with logger instance and subscription IDs
     */
    static subscribeToCategories(eventBus, categories, options = {}) {
        const logger = new WorkerEventLogger(options);
        const subscriptions = [];

        categories.forEach(category => {
            const categorySubscriptions = eventBus.subscribeToCategory(category, (data) => {
                // Create a mock emitter to reuse existing logger event handlers
                const mockEmitter = {
                    listeners: [],
                    on(eventName, handler) {
                        this.listeners.push({ eventName, handler });
                    },
                    emit(eventName, eventData) {
                        this.listeners.forEach(listener => {
                            if (listener.eventName === eventName) {
                                listener.handler(eventData);
                            }
                        });
                    }
                };

                // Attach logger and emit the event
                logger.attachTo(mockEmitter);
                mockEmitter.emit(data.eventName, data);
            });
            subscriptions.push(...categorySubscriptions);
        });

        return { logger, subscriptions };
    }
}
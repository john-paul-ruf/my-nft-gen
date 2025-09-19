import { WorkerEvents, WorkerEventCategories, getEventCategory } from './WorkerEventCategories.js';

/**
 * Worker Event Emitter that outputs structured events to stdout for the parent process
 */
export class WorkerEventEmitter {
    constructor(workerId = 'worker') {
        this.workerId = workerId;
        this.startTime = Date.now();
    }

    /**
     * Emit a structured event that the parent process can parse and categorize
     * @param {string} eventName - The event name from WorkerEvents
     * @param {Object} data - Event data
     * @param {number} timestamp - Optional timestamp (defaults to current time)
     * @param {boolean} force - Force emit even if verbosity is disabled
     */
    emit(eventName, data = {}, timestamp = Date.now(), force = false) {
        const category = getEventCategory(eventName);

        const structuredEvent = {
            type: 'WORKER_EVENT',
            workerId: this.workerId,
            eventName,
            category,
            timestamp,
            elapsedMs: timestamp - this.startTime,
            data
        };

        // Output as JSON to stdout - parent process will parse this
        console.log(JSON.stringify(structuredEvent));
    }

    /**
     * Emit a frame-related event
     */
    emitFrameStarted(frameNumber, totalFrames) {
        this.emit(WorkerEvents.FRAME_STARTED, {
            frameNumber,
            totalFrames,
            progress: frameNumber / totalFrames
        });
    }

    emitFrameCompleted(frameNumber, totalFrames, durationMs, outputPath) {
        this.emit(WorkerEvents.FRAME_COMPLETED, {
            frameNumber,
            totalFrames,
            durationMs,
            outputPath,
            progress: frameNumber / totalFrames
        });
    }

    emitFrameFailed(frameNumber, error) {
        this.emit(WorkerEvents.FRAME_FAILED, {
            frameNumber,
            error: error.message,
            stack: error.stack
        });
    }

    /**
     * Emit effect-related events
     */
    emitEffectStarted(effectName, frameNumber) {
        this.emit(WorkerEvents.EFFECT_STARTED, {
            effectName,
            frameNumber
        });
    }

    emitEffectCompleted(effectName, frameNumber, durationMs) {
        this.emit(WorkerEvents.EFFECT_COMPLETED, {
            effectName,
            frameNumber,
            durationMs
        });
    }

    emitEffectFailed(effectName, frameNumber, error) {
        this.emit(WorkerEvents.EFFECT_FAILED, {
            effectName,
            frameNumber,
            error: error.message,
            stack: error.stack
        });
    }

    /**
     * Emit file I/O events
     */
    emitFileWriteStarted(filePath, frameNumber) {
        this.emit(WorkerEvents.FILE_WRITE_STARTED, {
            filePath,
            frameNumber
        });
    }

    emitFileWriteCompleted(filePath, frameNumber, fileSizeBytes, durationMs) {
        this.emit(WorkerEvents.FILE_WRITE_COMPLETED, {
            filePath,
            frameNumber,
            fileSizeBytes,
            durationMs
        });
    }

    /**
     * Emit performance events
     */
    emitTimingFrame(frameNumber, totalMs, breakdowns = {}) {
        this.emit(WorkerEvents.TIMING_FRAME, {
            frameNumber,
            totalMs,
            breakdowns // e.g., { effects: 100, fileWrite: 50, composite: 25 }
        });
    }

    emitMemoryUsage(frameNumber, memoryUsage) {
        this.emit(WorkerEvents.MEMORY_USAGE, {
            frameNumber,
            ...memoryUsage // heapUsed, heapTotal, external, etc.
        });
    }

    /**
     * Emit resource events
     */
    emitBufferAllocated(size, purpose, frameNumber) {
        this.emit(WorkerEvents.BUFFER_ALLOCATED, {
            size,
            purpose,
            frameNumber
        });
    }

    emitBufferFreed(size, purpose, frameNumber) {
        this.emit(WorkerEvents.BUFFER_FREED, {
            size,
            purpose,
            frameNumber
        });
    }

    /**
     * Emit worker lifecycle events
     */
    emitWorkerStarted(config) {
        this.emit(WorkerEvents.WORKER_STARTED, {
            config: {
                frameStart: config.frameStart,
                frameEnd: config.frameEnd,
                totalFrames: config.totalFrames,
                workingDirectory: config.workingDirectory
            }
        });
    }

    emitWorkerCompleted(stats) {
        this.emit(WorkerEvents.WORKER_COMPLETED, {
            totalDurationMs: Date.now() - this.startTime,
            ...stats
        });
    }

    /**
     * Emit error events
     */
    emitWorkerError(error, context = {}) {
        this.emit(WorkerEvents.WORKER_ERROR, {
            error: error.message,
            stack: error.stack,
            ...context
        });
    }

    emitWorkerWarning(message, context = {}) {
        this.emit(WorkerEvents.WORKER_WARNING, {
            message,
            ...context
        });
    }

    emitFatalError(error, context = {}) {
        this.emit(WorkerEvents.FATAL_ERROR, {
            error: error.message,
            stack: error.stack,
            ...context
        });
    }

    /**
     * Log a regular message (not an event) - these won't be parsed as structured events
     */
    log(message, level = 'info') {
        console.log(`[${level.toUpperCase()}] ${message}`);
    }
}
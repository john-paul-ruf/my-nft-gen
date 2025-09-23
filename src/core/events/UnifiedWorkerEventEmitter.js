import { WorkerEvents, WorkerEventCategories, getEventCategory } from './WorkerEventCategories.js';

/**
 * Unified Worker Event Emitter - Integrates with GlobalEventBus
 * 
 * This enhanced version of WorkerEventEmitter can work in multiple modes:
 * 1. Stdout mode (for child processes) - outputs JSON to stdout
 * 2. Direct mode (for same-process workers) - emits directly to global bus
 * 3. Hybrid mode - both stdout and direct emission
 */
export class UnifiedWorkerEventEmitter {
    constructor(workerId = 'worker', options = {}) {
        this.workerId = workerId;
        this.startTime = Date.now();
        this.options = {
            mode: 'stdout', // 'stdout', 'direct', 'hybrid'
            globalBus: null, // GlobalEventBus instance for direct mode
            enableStdout: true,
            enableDirect: false,
            ...options
        };

        // Set mode-specific flags
        if (this.options.mode === 'direct') {
            this.options.enableStdout = false;
            this.options.enableDirect = true;
        } else if (this.options.mode === 'hybrid') {
            this.options.enableStdout = true;
            this.options.enableDirect = true;
        }

        if (this.options.enableDirect && !this.options.globalBus) {
            console.warn(`UnifiedWorkerEventEmitter[${workerId}]: Direct mode enabled but no globalBus provided`);
        }
    }

    /**
     * Set the global bus for direct emission
     */
    setGlobalBus(globalBus) {
        this.options.globalBus = globalBus;
        this.options.enableDirect = true;
        
        // Register this worker with the global bus
        if (globalBus.registerWorker) {
            globalBus.registerWorker(this.workerId, this);
        }
    }

    /**
     * Emit a structured event
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

        // Stdout emission (for child processes)
        if (this.options.enableStdout) {
            console.log(JSON.stringify(structuredEvent));
        }

        // Direct emission to global bus (for same-process workers)
        if (this.options.enableDirect && this.options.globalBus) {
            try {
                this.options.globalBus.emit(eventName, {
                    ...data,
                    workerId: this.workerId,
                    category,
                    timestamp,
                    elapsedMs: structuredEvent.elapsedMs,
                    workerEvent: true
                });
            } catch (error) {
                console.error(`UnifiedWorkerEventEmitter[${this.workerId}]: Error emitting to global bus:`, error);
            }
        }

        return structuredEvent;
    }

    /**
     * Emit with automatic global bus routing
     */
    emitToGlobal(eventName, data = {}) {
        if (this.options.globalBus) {
            return this.options.globalBus.emit(eventName, {
                ...data,
                workerId: this.workerId,
                timestamp: Date.now(),
                workerEvent: true
            });
        } else {
            console.warn(`UnifiedWorkerEventEmitter[${this.workerId}]: No global bus available for emitToGlobal`);
            return this.emit(eventName, data);
        }
    }

    /**
     * Subscribe to events from global bus (for bidirectional communication)
     */
    subscribeToGlobal(eventName, handler) {
        if (this.options.globalBus) {
            return this.options.globalBus.subscribe(eventName, handler, {
                component: `worker:${this.workerId}`
            });
        } else {
            console.warn(`UnifiedWorkerEventEmitter[${this.workerId}]: No global bus available for subscribeToGlobal`);
            return () => {}; // Return empty unsubscribe function
        }
    }

    // Enhanced frame events with global bus integration
    emitFrameStarted(frameNumber, totalFrames) {
        const data = {
            frameNumber,
            totalFrames,
            progress: frameNumber / totalFrames
        };
        
        this.emit(WorkerEvents.FRAME_STARTED, data);
        
        // Also emit progress event for UI
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:progress', {
                workerId: this.workerId,
                type: 'frame',
                current: frameNumber,
                total: totalFrames,
                progress: data.progress,
                status: 'started'
            });
        }
    }

    emitFrameCompleted(frameNumber, totalFrames, durationMs, outputPath) {
        const data = {
            frameNumber,
            totalFrames,
            durationMs,
            outputPath,
            progress: frameNumber / totalFrames
        };
        
        this.emit(WorkerEvents.FRAME_COMPLETED, data);
        
        // Also emit progress event for UI
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:progress', {
                workerId: this.workerId,
                type: 'frame',
                current: frameNumber,
                total: totalFrames,
                progress: data.progress,
                status: 'completed',
                durationMs,
                outputPath
            });
        }
    }

    emitFrameFailed(frameNumber, error) {
        const data = {
            frameNumber,
            error: error.message,
            stack: error.stack
        };
        
        this.emit(WorkerEvents.FRAME_FAILED, data);
        
        // Also emit error event for UI
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:error', {
                workerId: this.workerId,
                type: 'frame',
                frameNumber,
                error: error.message,
                stack: error.stack
            });
        }
    }

    // Enhanced effect events
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

    // File I/O events
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

    // Performance events
    emitTimingFrame(frameNumber, totalMs, breakdowns = {}) {
        this.emit(WorkerEvents.TIMING_FRAME, {
            frameNumber,
            totalMs,
            breakdowns
        });
    }

    emitMemoryUsage(frameNumber, memoryUsage) {
        this.emit(WorkerEvents.MEMORY_USAGE, {
            frameNumber,
            ...memoryUsage
        });
    }

    // Resource events
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

    // Worker lifecycle events
    emitWorkerStarted(config) {
        const data = {
            config: {
                frameStart: config.frameStart,
                frameEnd: config.frameEnd,
                totalFrames: config.totalFrames,
                workingDirectory: config.workingDirectory
            }
        };
        
        this.emit(WorkerEvents.WORKER_STARTED, data);
        
        // Notify global bus of worker startup
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:lifecycle', {
                workerId: this.workerId,
                status: 'started',
                config: data.config
            });
        }
    }

    emitWorkerCompleted(stats) {
        const data = {
            totalDurationMs: Date.now() - this.startTime,
            ...stats
        };
        
        this.emit(WorkerEvents.WORKER_COMPLETED, data);
        
        // Notify global bus of worker completion
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:lifecycle', {
                workerId: this.workerId,
                status: 'completed',
                stats: data
            });
        }
    }

    // Error events
    emitWorkerError(error, context = {}) {
        const data = {
            error: error.message,
            stack: error.stack,
            ...context
        };
        
        this.emit(WorkerEvents.WORKER_ERROR, data);
        
        // Notify global bus of worker error
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:error', {
                workerId: this.workerId,
                type: 'worker',
                error: error.message,
                stack: error.stack,
                context
            });
        }
    }

    emitWorkerWarning(message, context = {}) {
        this.emit(WorkerEvents.WORKER_WARNING, {
            message,
            ...context
        });
    }

    emitFatalError(error, context = {}) {
        const data = {
            error: error.message,
            stack: error.stack,
            ...context
        };
        
        this.emit(WorkerEvents.FATAL_ERROR, data);
        
        // Notify global bus of fatal error
        if (this.options.globalBus) {
            this.options.globalBus.emit('worker:fatal', {
                workerId: this.workerId,
                error: error.message,
                stack: error.stack,
                context
            });
        }
    }

    /**
     * Log a regular message (not an event)
     */
    log(message, level = 'info') {
        console.log(`[${level.toUpperCase()}] ${message}`);
    }

    /**
     * Get worker status for global bus integration
     */
    getStatus() {
        return {
            workerId: this.workerId,
            startTime: this.startTime,
            elapsedMs: Date.now() - this.startTime,
            mode: this.options.mode,
            hasGlobalBus: !!this.options.globalBus
        };
    }

    /**
     * Factory method to create worker emitter connected to global bus
     */
    static createWithGlobalBus(workerId, globalBus, options = {}) {
        const emitter = new UnifiedWorkerEventEmitter(workerId, {
            ...options,
            mode: 'direct',
            globalBus
        });
        return emitter;
    }

    /**
     * Factory method to create hybrid worker emitter (stdout + global bus)
     */
    static createHybrid(workerId, globalBus, options = {}) {
        const emitter = new UnifiedWorkerEventEmitter(workerId, {
            ...options,
            mode: 'hybrid',
            globalBus
        });
        return emitter;
    }
}
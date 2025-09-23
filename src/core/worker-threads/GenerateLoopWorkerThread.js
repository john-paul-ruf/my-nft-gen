import * as fs from "fs";
import { Settings } from "../Settings.js";
import { LoopBuilder } from "../animation/LoopBuilder.js";
import { WorkerEventEmitter } from "../events/WorkerEventEmitter.js";

// Global flag for graceful termination
let shouldTerminate = false;
let currentLoopBuilder = null;

const mainMenu = async () => {
    const eventEmitter = new WorkerEventEmitter(`loop-worker-${process.pid}`);

    // Set up termination signal handling
    setupTerminationHandling(eventEmitter);

    try {
        const filename = process.argv[2];
        const settings = await Settings.from(JSON.parse(fs.readFileSync(filename)));

        eventEmitter.emitWorkerStarted({
            frameStart: settings.frameStart,
            frameEnd: settings.config.numberOfFrame,
            totalFrames: settings.config.numberOfFrame,
            workingDirectory: settings.workingDirectory
        });

        currentLoopBuilder = new LoopBuilder(settings, eventEmitter);

        const startTime = Date.now();
        
        // Check for termination before starting
        if (shouldTerminate) {
            handleGracefulTermination(eventEmitter, 'terminated_before_start');
            return;
        }

        await currentLoopBuilder.constructLoop(); // Ensure it completes
        const totalDuration = Date.now() - startTime;

        // Check if we were terminated during execution
        if (shouldTerminate) {
            handleGracefulTermination(eventEmitter, 'terminated_during_execution');
            return;
        }

        eventEmitter.emitWorkerCompleted({
            totalFrames: settings.config.numberOfFrame,
            totalDurationMs: totalDuration,
            avgFrameTimeMs: totalDuration / settings.config.numberOfFrame
        });

        process.exit(0); // Success
    } catch (err) {
        eventEmitter.emitFatalError(err, {
            filename: process.argv[2]
        });
        console.error(`[LoopBuilder Error]: ${err.stack || err}`);
        process.exit(1); // Failure
    }
};

/**
 * Set up termination signal handling for graceful shutdown
 */
function setupTerminationHandling(eventEmitter) {
    // Listen for termination events from global event bus via stdin
    process.stdin.on('data', (data) => {
        try {
            const message = JSON.parse(data.toString().trim());
            if (message.type === 'EVENT' && message.eventName === 'worker:terminate') {
                const { workerId, reason } = message.data || {};
                
                // Check if this termination is for us (specific worker ID or 'all')
                if (workerId === eventEmitter.workerId || workerId === 'all') {
                    eventEmitter.emit('WORKER_TERMINATION_REQUESTED', {
                        reason: reason || 'external_request',
                        timestamp: Date.now()
                    });
                    
                    shouldTerminate = true;
                    
                    // If we have an active loop builder, try to stop it gracefully
                    if (currentLoopBuilder && typeof currentLoopBuilder.requestStop === 'function') {
                        currentLoopBuilder.requestStop();
                    }
                }
            }
        } catch (error) {
            // Not a JSON message, ignore
        }
    });

    // Handle standard termination signals
    process.on('SIGTERM', () => {
        eventEmitter.emit('WORKER_TERMINATION_REQUESTED', {
            reason: 'SIGTERM',
            timestamp: Date.now()
        });
        shouldTerminate = true;
        handleGracefulTermination(eventEmitter, 'SIGTERM');
    });

    process.on('SIGINT', () => {
        eventEmitter.emit('WORKER_TERMINATION_REQUESTED', {
            reason: 'SIGINT',
            timestamp: Date.now()
        });
        shouldTerminate = true;
        handleGracefulTermination(eventEmitter, 'SIGINT');
    });
}

/**
 * Handle graceful termination
 */
function handleGracefulTermination(eventEmitter, reason) {
    eventEmitter.emit('WORKER_TERMINATED', {
        reason,
        timestamp: Date.now(),
        graceful: true
    });
    
    console.log(`[LoopBuilder]: Gracefully terminating due to: ${reason}`);
    process.exit(0);
}

mainMenu();
import { execFile, fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module
import { globalEventBus } from '../events/GlobalEventBus.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the worker script dynamically
const workerScript = path.resolve(__dirname, 'GenerateAnimateFrameWorkerThread.js');

/**
 * Detect if we're running in an Electron environment
 */
function isElectron() {
    // Check for Electron-specific properties
    return !!(process.versions && process.versions.electron) ||
           (typeof process !== 'undefined' && process.type === 'renderer') ||
           (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0);
}

export const RequestNewFrameBuilderThread = (filename, frameNumber, eventEmitter = null, options = {}) => {
    // Default to show logs for debugging
    const defaultOptions = {
        suppressWorkerLogs: false,
        suppressWorkerErrors: false,
        returnProcess: false, // New option to return process handle
        ...options
    };

    // Declare variables that will be used to store process info
    let childProcess = null;
    let workerId = null;
    const isInElectron = isElectron();

    const promise = new Promise((resolve, reject) => {
        let child;

        if (isInElectron) {
            // Use fork for Electron compatibility
            console.log('[Electron detected] Using fork for frame builder thread');

            child = fork(workerScript, [filename, String(frameNumber)], {
                execPath: process.execPath,
                env: {
                    ...process.env,
                    ELECTRON_RUN_AS_NODE: '1',  // Tell Electron to run as Node.js
                    NFT_SUPPRESS_PER_FRAME_EVENTS: process.env.NFT_SUPPRESS_PER_FRAME_EVENTS || 'true',
                    NFT_VERBOSE_EVENTS: process.env.NFT_VERBOSE_EVENTS || 'false'
                },
                silent: true  // Capture stdout/stderr
            });

            // Set up promise resolution for fork
            let stdout = '';
            let stderr = '';

            if (child.stdout) {
                child.stdout.on('data', (data) => {
                    stdout += data.toString();
                });
            }

            if (child.stderr) {
                child.stderr.on('data', (data) => {
                    stderr += data.toString();
                    if (!defaultOptions.suppressWorkerErrors) {
                        console.error(`[Stderr]: ${data.toString().trim()}`);
                    }
                });
            }

            child.on('exit', (code, signal) => {
                // Clean up from global event bus when process completes
                globalEventBus.emit('workerCompleted', {
                    workerId,
                    frameNumber,
                    timestamp: Date.now(),
                    success: code === 0
                });

                if (code !== 0) {
                    reject(new Error(`[Error]: Process exited with code ${code}`));
                } else {
                    resolve(stdout.trim());
                }
            });

            child.on('error', (error) => {
                globalEventBus.emit('workerCompleted', {
                    workerId,
                    frameNumber,
                    timestamp: Date.now(),
                    success: false
                });
                reject(new Error(`[Error]: ${error.message}`));
            });
        } else {
            // Use execFile for regular Node.js environments
            const command = 'node';
            const args = [
                workerScript,
                filename,
                frameNumber
            ];

            // Execute the file with larger buffer and environment variables to control logging
            child = execFile(command, args, {
                maxBuffer: 1024 * 1024 * 200,
                env: {
                    ...process.env,
                    NFT_SUPPRESS_PER_FRAME_EVENTS: process.env.NFT_SUPPRESS_PER_FRAME_EVENTS || 'true',
                    NFT_VERBOSE_EVENTS: process.env.NFT_VERBOSE_EVENTS || 'false'
                }
            }, (error, stdout, stderr) => {
                // Clean up from global event bus when process completes
                globalEventBus.emit('workerCompleted', {
                    workerId,
                    frameNumber,
                    timestamp: Date.now(),
                    success: !error
                });

                if (error) {
                    reject(new Error(`[Error]: ${error.message}`));
                    return;
                }
                if (stderr) {
                    console.error(`[Stderr]: ${stderr}`);
                }
                resolve(stdout.trim());
            });
        }

        // Generate unique worker ID and register with global event bus
        workerId = `frame-builder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        childProcess = child;
        globalEventBus.registerWorker(workerId, child);

        // Emit worker started event
        globalEventBus.emit('workerStarted', {
            workerId,
            filename,
            frameNumber,
            type: 'frame-builder',
            timestamp: Date.now(),
            pid: child.pid
        });

        // Handle process termination
        child.on('exit', (code, signal) => {
            globalEventBus.emit('workerTerminated', {
                workerId,
                frameNumber,
                code,
                signal,
                timestamp: Date.now()
            });
        });

        // Listen to stdout for real-time logs
        if (child.stdout) {
            child.stdout.on('data', (data) => {
                const output = data.toString().trim();
                const lines = output.split('\n');

                lines.forEach(line => {
                    if (line.trim()) {
                        try {
                            // Try to parse as structured event
                            const event = JSON.parse(line);
                            if (event.type === 'WORKER_EVENT' && eventEmitter) {
                                // Re-emit the worker event through the project's event emitter
                                eventEmitter.emit(event.eventName, {
                                    ...event.data,
                                    workerId: event.workerId,
                                    category: event.category,
                                    timestamp: event.timestamp,
                                    elapsedMs: event.elapsedMs
                                });
                            } else if (!defaultOptions.suppressWorkerLogs) {
                                // Regular log message - only show if not suppressed
                                console.log(`[Worker Log]: ${line}`);
                            }
                        } catch (e) {
                            // Not JSON, treat as regular log - only show if not suppressed
                            if (!defaultOptions.suppressWorkerLogs) {
                                console.log(`[Worker Log]: ${line}`);
                            }
                        }
                    }
                });
            });
        }

        // Listen to stderr for real-time errors
        if (child.stderr) {
            child.stderr.on('data', (data) => {
                if (!defaultOptions.suppressWorkerErrors && !isInElectron) {
                    // Already handled above for Electron
                    console.error(`[Worker Error]: ${data.toString().trim()}`);
                }
            });
        }
    });

    // Add the child process and worker ID to the promise after it's created
    promise.childProcess = childProcess;
    promise.workerId = workerId;

    return promise;
};
import {execFile, fork} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url'; // Import fileURLToPath from the 'url' module
import { globalEventBus } from '../events/GlobalEventBus.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the worker script dynamically
const workerScript = path.resolve(__dirname, 'GenerateLoopWorkerThread.js');

/**
 * Detect if we're running in an Electron environment
 */
function isElectron() {
    // Check for Electron-specific properties
    return !!(process.versions && process.versions.electron) ||
           (typeof process !== 'undefined' && process.type === 'renderer') ||
           (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0);
}

export const RequestNewWorkerThread = (filename, eventBusOrEmitter = null, options = {}) => {
    return new Promise((resolve, reject) => {
        let child;
        const isInElectron = isElectron();

        if (isInElectron) {
            // Use fork for Electron compatibility
            console.log('[Electron detected] Using fork for worker thread');

            child = fork(workerScript, [filename], {
                execPath: process.execPath,
                env: {
                    ...process.env,
                    ELECTRON_RUN_AS_NODE: '1'  // Tell Electron to run as Node.js
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
                    if (!options.suppressWorkerErrors) {
                        console.error(`[Stderr]: ${data.toString().trim()}`);
                    }
                });
            }

            child.on('exit', (code, signal) => {
                if (code !== 0) {
                    reject(new Error(`[Error]: Process exited with code ${code}`));
                } else {
                    resolve(stdout.trim());
                }
            });

            child.on('error', (error) => {
                reject(new Error(`[Error]: ${error.message}`));
            });
        } else {
            // Use execFile for regular Node.js environments
            const command = 'node';
            const args = [
                workerScript,
                filename,
            ];

            // Execute the file
            child = execFile(command, args, {maxBuffer: 1024 * 1024 * 30}, (error, stdout, stderr) => {
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
        const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        globalEventBus.registerWorker(workerId, child);

        // Emit worker started event
        globalEventBus.emit('workerStarted', {
            workerId,
            filename,
            timestamp: Date.now(),
            pid: child.pid
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
                            if (event.type === 'WORKER_EVENT' && eventBusOrEmitter) {
                                // Check if it's a UnifiedEventBus or regular EventEmitter
                                if (eventBusOrEmitter.emitWorkerEvent) {
                                    // It's a UnifiedEventBus - use the specialized method
                                    eventBusOrEmitter.emitWorkerEvent(event.eventName, {
                                        ...event.data,
                                        workerId: event.workerId,
                                        elapsedMs: event.elapsedMs
                                    });
                                } else {
                                    // It's a regular EventEmitter - use standard emit
                                    eventBusOrEmitter.emit(event.eventName, {
                                        ...event.data,
                                        workerId: event.workerId,
                                        category: event.category,
                                        timestamp: event.timestamp,
                                        elapsedMs: event.elapsedMs
                                    });
                                }
                            } else if (!options.suppressWorkerLogs) {
                                // Regular log message - only show if not suppressed
                                console.log(`[Worker Log]: ${line}`);
                            }
                        } catch (e) {
                            // Not JSON, treat as regular log - only show if not suppressed
                            if (!options.suppressWorkerLogs) {
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
                if (!options.suppressWorkerErrors && !isInElectron) {
                    // Already handled above for Electron
                    console.error(`[Worker Error]: ${data.toString().trim()}`);
                }
            });
        }

        // Handle worker process termination
        child.on('exit', (code, signal) => {
            globalEventBus.emit('workerTerminated', {
                workerId,
                filename,
                exitCode: code,
                signal,
                timestamp: Date.now()
            });
        });

        child.on('error', (error) => {
            globalEventBus.emit('workerError', {
                workerId,
                filename,
                error: error.message,
                timestamp: Date.now()
            });
        });
    });
};
import {execFile} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url'; // Import fileURLToPath from the 'url' module
import { globalEventBus } from '../events/GlobalEventBus.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the worker script dynamically
const workerScript = path.resolve(__dirname, 'GenerateLoopWorkerThread.js');

export const RequestNewWorkerThread = (filename, eventBusOrEmitter = null, options = {}) => {
    return new Promise((resolve, reject) => {
        // Define the command and arguments
        const command = 'node';
        const args = [
            workerScript,
            filename,
        ];

        // Execute the file
        const child = execFile(command, args, {maxBuffer: 1024 * 1024 * 30}, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`[Error]: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(`[Stderr]: ${stderr}`);
            }
            resolve(stdout.trim());
        });

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

        // Listen to stderr for real-time errors
        child.stderr.on('data', (data) => {
            if (!options.suppressWorkerErrors) {
                console.error(`[Worker Error]: ${data.toString().trim()}`);
            }
        });

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

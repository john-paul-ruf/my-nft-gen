import {execFile} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url'; // Import fileURLToPath from the 'url' module

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

        // Execute the file with IPC for better communication
        const child = execFile(command, args, {
            maxBuffer: 1024 * 1024 * 200, // Increase buffer as backup
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'] // Enable IPC
        }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`[Error]: ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(`[Stderr]: ${stderr}`);
            }
            resolve(stdout.trim());
        });

        // Listen to IPC messages for structured events (primary communication)
        child.on('message', (event) => {
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
            }
        });

        // No stdout parsing - all communication via IPC

        // Listen to stderr for real-time errors
        child.stderr.on('data', (data) => {
            if (!options.suppressWorkerErrors) {
                console.error(`[Worker Error]: ${data.toString().trim()}`);
            }
        });
    });
};

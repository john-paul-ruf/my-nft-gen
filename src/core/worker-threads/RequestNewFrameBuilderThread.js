import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the worker script dynamically
const workerScript = path.resolve(__dirname, 'GenerateAnimateFrameWorkerThread.js');

export const RequestNewFrameBuilderThread = (filename, frameNumber, eventEmitter = null, options = {}) => {
    // Default to show logs for debugging
    const defaultOptions = {
        suppressWorkerLogs: false,
        suppressWorkerErrors: false,
        ...options
    };
    return new Promise((resolve, reject) => {
        // Define the command and arguments
        const command = 'node';
        const args = [
            workerScript,
            filename,
            frameNumber
        ];

        // Execute the file with larger buffer and environment variables to control logging
        const child = execFile(command, args, {
            maxBuffer: 1024 * 1024 * 200,
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'], // Enable IPC
            env: {
                ...process.env,
                NFT_SUPPRESS_PER_FRAME_EVENTS: process.env.NFT_SUPPRESS_PER_FRAME_EVENTS || 'true',
                NFT_VERBOSE_EVENTS: process.env.NFT_VERBOSE_EVENTS || 'false'
            }
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
            if (event.type === 'WORKER_EVENT' && eventEmitter) {
                // Re-emit the worker event through the project's event emitter
                eventEmitter.emit(event.eventName, {
                    ...event.data,
                    workerId: event.workerId,
                    category: event.category,
                    timestamp: event.timestamp,
                    elapsedMs: event.elapsedMs
                });
            }
        });

        // No stdout parsing - all communication via IPC

        // Listen to stderr for real-time errors
        child.stderr.on('data', (data) => {
            if (!defaultOptions.suppressWorkerErrors) {
                console.error(`[Worker Error]: ${data.toString().trim()}`);
            }
        });
    });
};

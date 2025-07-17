import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the worker script dynamically
const workerScript = path.resolve(__dirname, 'GenerateAnimateFrameWorkerThread.js');

export const RequestNewFrameBuilderThread = (filename, frameNumber) => {
    return new Promise((resolve, reject) => {
        // Define the command and arguments
        const command = 'node';
        const args = [
            workerScript,
            filename,
            frameNumber
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

        // Listen to stdout for real-time logs
        child.stdout.on('data', (data) => {
            console.log(`[Worker Log]: ${data.toString().trim()}`);
        });

        // Listen to stderr for real-time errors
        child.stderr.on('data', (data) => {
           console.error(`[Worker Error]: ${data.toString().trim()}`);
        });
    });
};

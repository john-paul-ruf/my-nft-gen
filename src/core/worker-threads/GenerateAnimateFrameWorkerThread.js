import fs from "fs";
import { Settings } from "../Settings.js";
import { CreateFrame } from "../animation/CreateFrame.js";
import { WorkerEventEmitter } from "../events/WorkerEventEmitter.js";

const GenerateAnimateFrameWorkerThread = async () => {
    const eventEmitter = new WorkerEventEmitter(`frame-worker-${process.pid}`);

    try {
        const filename = process.argv[2];
        const frameNumber = parseInt(process.argv[3]);

        const settings = await Settings.from(JSON.parse(fs.readFileSync(filename)));

        eventEmitter.emitWorkerStarted({
            frameStart: frameNumber,
            frameEnd: frameNumber,
            totalFrames: 1,
            workingDirectory: settings.workingDirectory
        });

        const frameStartTime = Date.now();
        const frameBuilder = new CreateFrame(settings, eventEmitter);

        await frameBuilder.createSingleFrame(frameNumber);

        const frameDuration = Date.now() - frameStartTime;
        const outputPath = `${settings.workingDirectory}${settings.config.finalFileName}-frame-${frameNumber}.png`;

        eventEmitter.emitFrameCompleted(frameNumber, settings.config.numberOfFrame, frameDuration, outputPath);

        // Emit memory usage
        const memUsage = process.memoryUsage();
        eventEmitter.emitMemoryUsage(frameNumber, memUsage);

        eventEmitter.emitWorkerCompleted({
            framesProcessed: 1,
            avgFrameTimeMs: frameDuration
        });

        // Success
        process.exit(0);
    } catch (err) {
        eventEmitter.emitFatalError(err, {
            frameNumber: process.argv[3],
            filename: process.argv[2]
        });
        console.error(`[Worker Fatal Error]: ${err.stack || err}`);
        // Exit with failure
        process.exit(1);
    }
};

GenerateAnimateFrameWorkerThread();

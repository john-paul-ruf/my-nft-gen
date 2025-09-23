import * as fs from "fs";
import { Settings } from "../Settings.js";
import { LoopBuilder } from "../animation/LoopBuilder.js";
import { WorkerEventEmitter } from "../events/WorkerEventEmitter.js";

const mainMenu = async () => {
    const eventEmitter = new WorkerEventEmitter(`loop-worker-${process.pid}`);

    try {
        const filename = process.argv[2];
        const settings = await Settings.from(JSON.parse(fs.readFileSync(filename)));

        eventEmitter.emitWorkerStarted({
            frameStart: settings.frameStart,
            frameEnd: settings.config.numberOfFrame,
            totalFrames: settings.config.numberOfFrame,
            workingDirectory: settings.workingDirectory
        });

        const loopBuilder = new LoopBuilder(settings, eventEmitter);

        const startTime = Date.now();
        await loopBuilder.constructLoop(); // Ensure it completes
        const totalDuration = Date.now() - startTime;

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

mainMenu();
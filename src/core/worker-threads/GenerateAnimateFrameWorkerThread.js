import fs from "fs";
import { Settings } from "../Settings.js";
import { CreateFrame } from "../animation/CreateFrame.js";

const GenerateAnimateFrameWorkerThread = async () => {
    try {
        const filename = process.argv[2];
        const frameNumber = parseInt(process.argv[3]);

        const settings = Settings.from(JSON.parse(fs.readFileSync(filename)));
        const frameBuilder = new CreateFrame(settings);

        await frameBuilder.createSingleFrame(frameNumber);

        // Success
        process.exit(0);
    } catch (err) {
        console.error(`[Worker Fatal Error]: ${err.stack || err}`);
        // Exit with failure
        process.exit(1);
    }
};

GenerateAnimateFrameWorkerThread();

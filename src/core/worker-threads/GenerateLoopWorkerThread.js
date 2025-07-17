import * as fs from "fs";
import { Settings } from "../Settings.js";
import { LoopBuilder } from "../animation/LoopBuilder.js";

const mainMenu = async () => {
    try {
        const filename = process.argv[2];
        const settings = Settings.from(JSON.parse(fs.readFileSync(filename)));
        const loopBuilder = new LoopBuilder(settings);

        await loopBuilder.constructLoop(); // Ensure it completes

        process.exit(0); // Success
    } catch (err) {
        console.error(`[LoopBuilder Error]: ${err.stack || err}`);
        process.exit(1); // Failure
    }
};

mainMenu();
import {Settings} from "./core/Settings.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";
import parseArgs from "minimist";
import {SettingsFactory} from "./core/SettingsFactory.js";
import fs from "fs";
import {GlobalSettings} from "./core/GlobalSettings.js";

//how many you want to print?
const argv = parseArgs(process.argv)
const batchAmount = argv.hasOwnProperty('batchAmount') ? parseInt(argv.batchAmount) : -1;

if (batchAmount > 0) {
    async function CreateLoop() {
        ////////////////////////////////////////////////
        // Don't like the bluePlateSpecial?
        // Try customizing the everythingBagel to see what
        // pretties you can create!
        ////////////////////////////////////////////////
        const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.bluePlateSpecial});

        //For testing, output is unknown
        //const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.experimental});

        //For testing, output is gross
        //const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.everythingBagel});

        //Program now outputs a json file on loop start
        //This json file can be loaded again in case of failure to recreate the loop
        //const settings = Settings.from(JSON.parse(fs.readFileSync(GlobalSettings.getWorkingDirectory() + '_test-settings.json')))

        const loopBuilder = new LoopBuilder(settings);
        return loopBuilder.constructLoop();
    }

    const promiseArray = []

    for (let i = 0; i < batchAmount; i++) {
        promiseArray.push(CreateLoop());
    }

    Promise.all(promiseArray).then(() => {
        //end
    });
}
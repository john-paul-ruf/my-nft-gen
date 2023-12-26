import {Settings} from "./core/Settings.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";
import parseArgs from "minimist";
import {SettingsFactory} from "./core/SettingsFactory.js";

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
        //const settings = new Settings(bluePlateSpecial);
        const settings = new Settings(await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.everythingBagel}));
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
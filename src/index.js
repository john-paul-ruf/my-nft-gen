import {Settings} from "./core/Settings.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import parseArgs from "minimist";
import {randomId} from "./core/math/random.js";

//how many you want to print?
const argv = parseArgs(process.argv)
const batchAmount = argv.hasOwnProperty('batchAmount') ? parseInt(argv.batchAmount) : -1;

if (batchAmount > 0) {

    //My current settings
    const bluePlateSpecial =
        {
            colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
            neutrals: ['#FFFFFF'],
            backgrounds: ['#000000',],
            lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
            _INVOKER_: 'John Ruf',
            runName: 'neon-dreams',
            frameInc: 1,
            numberOfFrame: 1800,
            finalFileName: randomId(),
        }

    async function CreateLoop() {
        const settings = new Settings(bluePlateSpecial);
        const loopBuilder = new LoopBuilder(settings);
        return loopBuilder.animate();
    }

    const promiseArray = []

    for (let i = 0; i < batchAmount; i++) {
        promiseArray.push(CreateLoop());
    }

    Promise.all(promiseArray).then(() => {
        //end
    });
}
import {Settings} from "./core/Settings.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";

const batchAmount = 3;

async function CreateLoop() {
    const settings = new Settings();
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


import {animationConfiguration} from "./core/AnimationConfiguration.js";
import {animate} from "./core/animation/animate.js";
import {resetGlobalSettings} from "./core/GlobalSettings.js";

//To run: install node
//from terminal in correct directory
//node 'src/index.js'
for (let i = 0; i < 10; i++) {
    console.log("started process");
    resetGlobalSettings();
    const config = new animationConfiguration();
    await animate(config);
    console.log("completed process");
}



//https://github.com/Automattic/node-canvas/issues/2155#issuecomment-1669503493
import {createCanvas} from "canvas";
import sharp from "sharp";

import {animationConfiguration} from "./core/AnimationConfiguration.js";
import {animate} from "./core/animation/animate.js";
import {resetGlobalSettings} from "./core/GlobalSettings.js";

//To run: install node
//from terminal in correct directory
//node 'src/index.js'
for (let i = 0; i < 5; i++) { //after all... why not print ten per thread?
    console.log("started process");
    resetGlobalSettings();
    const config = new animationConfiguration();
    await animate(config);
    console.log("completed process");
}



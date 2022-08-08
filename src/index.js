import {Config} from "./logic/core/Config.js";
import {animate} from "./logic/core/animate.js";

//To run: install node
//from terminal in correct directory
//node 'src/index.js'
for (let i = 0; i < 5; i++) {
    console.log("started process");
    const config = new Config();
    await animate(config);
    console.log("completed process");
}



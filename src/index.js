import {Config} from "./logic/Config.js";
import {animate} from "./logic/animate.js";

for(let i = 0; i < 100; i++)
{
    console.log("started process");
    const config = new Config();
    await animate(config);
    console.log("completed process");
}



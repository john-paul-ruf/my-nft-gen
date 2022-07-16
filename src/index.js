import {Config} from "./logic/Config.js";
import {animate} from "./logic/animate.js";

//To run: install node
//from terminal in correct diretory
//node 'src/index.js'
for(let i = 0; i < 25; i++)
{
    console.log("started process");
    const config = new Config();
    await animate(config);
    console.log("completed process");
}



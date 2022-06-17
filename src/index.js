import {ControlPlane} from "./logic/ControlPlane.js";
import {animate} from "./logic/animate.js";

for(let i = 0; i < 100; i++)
{
    console.log("started process");
    const controlPlane = new ControlPlane();
    await animate(controlPlane);
    console.log("completed process");
}



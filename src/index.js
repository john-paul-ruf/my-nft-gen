import {ControlPlane} from "./logic/ControlPlane.js";

for(let i = 0; i < 100; i++)
{
    console.log("started process");
    const controlPlane = new ControlPlane();
    controlPlane.processControlPlane()
    console.log("completed process");
}



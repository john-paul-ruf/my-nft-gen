import {Project} from "./app/Project.js";
import {LayerConfig} from "./core/layer/LayerConfig.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import {ColorPicker} from "./core/layer/configType/ColorPicker.js";
import {RedEyeEffect} from "./effects/primaryEffects/red-eye/RedEyeEffect.js";
import {Point2D} from "./core/layer/configType/Point2D.js";
import {RedEyeConfig} from "./effects/primaryEffects/red-eye/RedEyeConfig.js";

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'red-eye',
    projectDirectory: "src/red-eye/",
    neutrals: ['#FFFFFF'],
    backgrounds: ['#000000'],
    numberOfFrame:240,
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: RedEyeEffect,
        percentChance: 100,
        currentEffectConfig: new RedEyeConfig({
        })
    })
});

const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

promiseArray.push(myTestProject.generateRandomLoop());

await Promise.all(promiseArray);




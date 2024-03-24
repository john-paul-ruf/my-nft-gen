import {Project} from "./app/Project.js";
import {LayerConfig} from "./core/layer/LayerConfig.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import {ColorPicker} from "./core/layer/configType/ColorPicker.js";
import {RedEyeEffect} from "./effects/primaryEffects/red-eye/RedEyeEffect.js";
import {Point2D} from "./core/layer/configType/Point2D.js";
import {RedEyeConfig} from "./effects/primaryEffects/red-eye/RedEyeConfig.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";
import {ImageOverlayEffect} from "./effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ImageOverlayConfig} from "./effects/primaryEffects/imageOverlay/ImageOverlayConfig.js";
import {MappedFramesEffect} from "./effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {MappedFramesConfig} from "./effects/primaryEffects/mappedFrames/MappedFramesConfig.js";

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'red-eye',
    projectDirectory: "src/red-eye/",
    neutrals: ['#FFFFFF'],
    backgrounds: ['#000000'],
    numberOfFrame: 1800,
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: RedEyeEffect,
        percentChance: 100,
        currentEffectConfig: new RedEyeConfig({
            invertLayers: true,
            layerOpacity: 1,
            underLayerOpacity: 0.75,
            center: new Point2D(1080 / 2, 1920 / 2),
            innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke: 1,
            thickness: 1,
            sparsityFactor: [45],
            innerRadius: 200,
            outerRadius: 700,
            possibleJumpRangeInPixels: {lower: 10, upper: 30},
            lineLength: {lower: 200, upper: 200},
            numberOfLoops: {lower: 1, upper: 1},
            accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes: {lower: 2, upper: 4},
        })
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: RedEyeEffect,
        percentChance: 100,
        currentEffectConfig: new RedEyeConfig({
            invertLayers: true,
            layerOpacity: 0.55,
            underLayerOpacity: 0.75,
            center: new Point2D(1080 / 2, 1920 / 2),
            innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke: 2,
            thickness: 1,
            sparsityFactor: [9],
            innerRadius: 175,
            outerRadius: 600,
            possibleJumpRangeInPixels: {lower: 10, upper: 30},
            lineLength: {lower: 150, upper: 150},
            numberOfLoops: {lower: 2, upper: 2},
            accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes: {lower: 2, upper: 4},
        })
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: RedEyeEffect,
        percentChance: 100,
        currentEffectConfig: new RedEyeConfig({
            invertLayers: true,
            layerOpacity: 0.55,
            underLayerOpacity: 0.75,
            center: new Point2D(1080 / 2, 1920 / 2),
            innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke: 2,
            thickness: 1,
            sparsityFactor: [12],
            innerRadius: 150,
            outerRadius: 500,
            possibleJumpRangeInPixels: {lower: 10, upper: 30},
            lineLength: {lower: 100, upper: 100},
            numberOfLoops: {lower: 4, upper: 4},
            accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes: {lower: 2, upper: 4},
        })
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 470,
            length: 10,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 240, upper: 240},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
        }), defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 484,
            length: 10,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 480, upper: 480},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
        }), defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 498,
            length: 10,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 720, upper: 720},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
        }), defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 512,
            length: 10,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 480, upper: 480},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
        }), defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect, percentChance: 100, currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 526,
            length: 10,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 240, upper: 240},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
        }), defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: MappedFramesEffect,
        percentChance: 100,
        currentEffectConfig: new MappedFramesConfig({
            folderName: '/mappedFrames/',
            layerOpacity: [0.90],
            buffer: [555],
            loopTimes: 20,
        })
    })
});


const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

promiseArray.push(myTestProject.generateRandomLoop());

await Promise.all(promiseArray);




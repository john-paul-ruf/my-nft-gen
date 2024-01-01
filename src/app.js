import {Project} from "./app/Project.js";
import {LayerConfig} from "./effects/LayerConfig.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {ColorScheme} from "./core/color/ColorScheme.js";

const myTestProject = new Project({
    artist: 'Test Artist',
    projectName:'Test Project',
});

myTestProject.colorScheme = new ColorScheme({
    colorBucket: ['#004890','#87F892','#f93005','#095425'],
    colorSchemeInfo: 'Test color scheme'
})

await myTestProject.addPrimaryEffect({layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            lineStart:50,
            length:125,
            sparsityFactor: [5,6, 8]
        }),
        defaultEffectConfig: AmpConfig
    })});


await myTestProject.addPrimaryEffect({layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            lineStart:250,
            length:50,
            sparsityFactor: [1]
        }),
        defaultEffectConfig: AmpConfig
    })});


await myTestProject.addPrimaryEffect({layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            lineStart:400,
            length:50,
            sparsityFactor: [5,6, 8]
        }),
        defaultEffectConfig: AmpConfig
    })});

await myTestProject.generateRandomLoop();


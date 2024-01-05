import {Project} from "./app/Project.js";
import {LayerConfig} from "./core/layer/LayerConfig.js";
import {AmpConfig} from "./effects/primaryEffects/amp/AmpConfig.js";
import {AmpEffect} from "./effects/primaryEffects/amp/AmpEffect.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import {ScopesEffect} from "./effects/primaryEffects/scopes/ScopesEffect.js";
import {ScopesConfig} from "./effects/primaryEffects/scopes/ScopesConfig.js";
import {FuzzyBandEffect} from "./effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyBandConfig} from "./effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js";
import {EncircledSpiralEffect} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {EncircledSpiralConfig} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js";
import {ViewportEffect} from "./effects/primaryEffects/viewport/ViewportEffect.js";
import {ViewportConfig} from "./effects/primaryEffects/viewport/ViewportConfig.js";
import {MappedFramesEffect} from "./effects/primaryEffects/mappedFrames/MappedFramesEffect.js";
import {MappedFramesConfig} from "./effects/primaryEffects/mappedFrames/MappedFramesConfig.js";
import {LayeredHexEffect} from "./effects/primaryEffects/layeredHex/LayeredHexEffect.js";
import {LayeredHexConfig} from "./effects/primaryEffects/layeredHex/LayeredHexConfig.js";
import {GlowEffect} from "./effects/secondaryEffects/glow/GlowEffect.js";
import {GlowConfig} from "./effects/secondaryEffects/glow/GlowConfig.js";

const ampLineStart = 400;
const ampLength = 200;
const ampOuterColor = '#FF00FF'

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'the-advance',
    projectDirectory: "src/the-advance/",
    neutrals: ['#000000']
});

myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            invertLayers: false,
            thickness: 24,
            circles: {lower: 10, upper: 10},
            radius: {
                lower: (finalSize) => finalSize.shortestSide * 0.10,
                upper: (finalSize) => finalSize.longestSide * 0.65
            }
        }),
        defaultEffectConfig: FuzzyBandConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            thickness: 5,
            stroke: 2,
            initialNumberOfPoints: 4,
            scaleByFactor: 1.25,
            radius: {lower: 60, upper: 100},
            offsetRadius: {lower: 120, upper: 130},
            startIndex: {lower: 2, upper: 2},
        }),
        defaultEffectConfig: LayeredHexConfig
    })
});


await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            lineStart: ampLineStart,
            length: ampLength,
            sparsityFactor: [1],
            center: {x: -300, y: 1920 / 2},
            outerColor: ampOuterColor,
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            lineStart: ampLineStart,
            length: ampLength,
            sparsityFactor: [1],
            center: {x: 1380, y: 1920 / 2},
            outerColor: ampOuterColor,
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            lineStart: ampLineStart,
            length: ampLength,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: -300},
            outerColor: ampOuterColor,
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            lineStart: ampLineStart,
            length: ampLength,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 2220},
            outerColor: ampOuterColor,
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});
await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: EncircledSpiralEffect,
        percentChance: 100,
        currentEffectConfig: new EncircledSpiralConfig({
            invertLayers: false,
            layerOpacity: 0.75,
            underLayerOpacity: 0.75,
            thickness: 5,
            numberOfRings: {lower: 10, upper: 10}
        }),
        defaultEffectConfig: EncircledSpiralConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            thickness: 3,
            lineStart: 100,
            length: 225,
            sparsityFactor: [8],
            center: {x: 1080 / 2, y: 1920 / 2},
            outerColor: '#FF0000',
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});


await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ScopesEffect,
        percentChance: 100,
        currentEffectConfig: new ScopesConfig({
            layerOpacity: 1
        }),
        defaultEffectConfig: ScopesConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ViewportEffect,
        percentChance: 100,
        currentEffectConfig: new ViewportConfig({
            invertLayers: false,
            underLayerOpacity: 0.75,
            thickness: 20,
            stroke: 5,
            layerOpacity: 0.5,
            amplitude: {lower: 50, upper: 50},
            ampRadius: {lower: 300, upper: 300}
        }),
        defaultEffectConfig: ViewportConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: MappedFramesEffect,
        percentChance: 100,
        currentEffectConfig: new MappedFramesConfig({
            layerOpacity: 0.85
        }),
        possibleSecondaryEffects: [
            new LayerConfig({
                effect: GlowEffect,
                percentChance: 100,
                currentEffectConfig: new GlowConfig(
                    {
                        lowerRange: {lower: -128, upper: -64},
                        upperRange: {lower: 64, upper: 128},
                        times: {lower: 4, upper: 6},
                    }
                ),
                defaultEffectConfig: GlowConfig
            })
        ],
        defaultEffectConfig: MappedFramesConfig
    })
});


await myTestProject.generateRandomLoop();





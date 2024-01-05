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
        possibleSecondaryEffects: [
            new LayerConfig({
                effect: GlowEffect,
                percentChance: 100,
                currentEffectConfig: new GlowConfig(
                    {
                        lowerRange: {lower: -16, upper: -8},
                        upperRange: {lower: 8, upper: 16},
                        times: {lower: 4, upper: 4},
                    }
                ),
                defaultEffectConfig: GlowConfig
            })
        ],
        defaultEffectConfig: FuzzyBandConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 1,
            thickness: 4,
            lineStart: 200,
            length: 200,
            sparsityFactor: [4],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 1,
            thickness: 2,
            lineStart: 700,
            length: 150,
            sparsityFactor: [2],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 1,
            thickness: 3,
            lineStart: 450,
            length: 200,
            sparsityFactor: [3],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 20, upper: 20},
        }),
        defaultEffectConfig: AmpConfig,
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            thickness: 6,
            stroke: 1,
            initialNumberOfPoints: 4,
            scaleByFactor: 1.15,
            radius: {lower: 40, upper: 60},
            offsetRadius: {lower: 50, upper: 80},
            startIndex: {lower: 2, upper: 2},
            accentRange:{bottom: {lower: 1, upper: 1}, top: {lower: 10, upper: 20}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 3}},
            featherTimes: {lower: 2, upper: 4},
        }),
        defaultEffectConfig: LayeredHexConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: EncircledSpiralEffect,
        percentChance: 0,
        currentEffectConfig: new EncircledSpiralConfig({
            invertLayers: false,
            layerOpacity: 1,
            underLayerOpacity: 0.50,
            thickness: 5,
            numberOfRings: {lower: 10, upper: 10}
        }),
        defaultEffectConfig: EncircledSpiralConfig
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
        effect: MappedFramesEffect,
        percentChance: 100,
        currentEffectConfig: new MappedFramesConfig({
            layerOpacity: 0.85,
            buffer:[600]
        }),
        possibleSecondaryEffects: [
            new LayerConfig({
                effect: GlowEffect,
                percentChance: 100,
                currentEffectConfig: new GlowConfig(
                    {
                        lowerRange: {lower: -16, upper: -8},
                        upperRange: {lower: 8, upper: 16},
                        times: {lower: 4, upper:4},
                    }
                ),
                defaultEffectConfig: GlowConfig
            })
        ],
        defaultEffectConfig: MappedFramesConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ViewportEffect,
        percentChance: 100,
        currentEffectConfig: new ViewportConfig({
            invertLayers: false,
            underLayerOpacity: 0.5,
            thickness: 20,
            stroke: 5,
            layerOpacity: 0.5,
            amplitude: {lower: 50, upper: 50},
            ampRadius: {lower: 300, upper: 300}
        }),
        defaultEffectConfig: ViewportConfig
    })
});



await myTestProject.generateRandomLoop();




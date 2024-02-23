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
import {LensFlareEffect} from "./effects/primaryEffects/lensFlare/LensFlareEffect.js";
import {LensFlareConfig} from "./effects/primaryEffects/lensFlare/LensFlareConfig.js";
import {Range} from "./core/layer/configType/Range.js";
import {ColorPicker} from "./core/layer/configType/ColorPicker.js";
import {findPointByAngleAndCircle} from "./core/math/drawingMath.js";
import {Point2D} from "./core/layer/configType/Point2D.js";
import {FuzzyRipplesEffect} from "./effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js";
import {FuzzyRipplesConfig} from "./effects/primaryEffects/fuzzyRipples/FuzzyRipplesConfig.js";
import {PercentageRange} from "./core/layer/configType/PercentageRange.js";
import {PercentageLongestSide} from "./core/layer/configType/PercentageLongestSide.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveEffect
} from "./effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js";
import {
    SingleLayerGlitchDrumrollHorizontalWaveConfig
} from "./effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveConfig.js";
import {ImageOverlayEffect} from "./effects/primaryEffects/imageOverlay/ImageOverlayEffect.js";
import {ImageOverlayConfig} from "./effects/primaryEffects/imageOverlay/ImageOverlayConfig.js";
import {HexConfig} from "./effects/primaryEffects/hex/HexConfig.js";
import {HexEffect} from "./effects/primaryEffects/hex/HexEffect.js";
import {LayeredRingEffect} from "./effects/primaryEffects/layeredRing/LayeredRingEffect.js";
import {LayeredRingConfig} from "./effects/primaryEffects/layeredRing/LayeredRingConfig.js";

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'the-advance',
    projectDirectory: "src/the-advance/",
    neutrals: ['#FFFFFF'],
    backgrounds: ['#000000']
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            layerOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
            layerOpacityTimes: {lower: 4, upper: 8},
            indexOpacityRange: {bottom: {lower: 0.3, upper: 0.4}, top: {lower: 0.5, upper: 0.6}},
            indexOpacityTimes: {lower: 4, upper: 8},
            thickness: 3,
            stroke: 1,
            layerOpacity: 0.25,
            radius: {lower: 30, upper: 40},
            offsetRadius: {lower: 40, upper: 40},
            numberOfIndex: {lower: 20, upper: 20},
            startIndex: {lower: 17, upper: 17},
            initialNumberOfPoints: 10,
            scaleByFactor: 1.1,
            movementGaston: {lower: 6, upper: 12},
            accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes: {lower: 4, upper: 8},
        }),
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            layerOpacity: 0.75,
            color: new ColorPicker(),
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
            invertLayers: true,
            thickness: 1,
            circles: {lower: 10, upper: 10},
            radius: {
                lower: (finalSize) => finalSize.shortestSide * 0.1,
                upper: (finalSize) => finalSize.longestSide * 0.55
            },
            accentRange: {bottom: {lower: 6, upper: 12}, top: {lower: 35, upper: 75}},
            blurRange: {bottom: {lower: 1, upper: 3}, top: {lower: 8, upper: 12}},
            featherTimes: {lower: 8, upper: 8},
        }),
        defaultEffectConfig: FuzzyBandConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            layerOpacityRange: {bottom: {lower: 0.4, upper: 0.5}, top: {lower: 0.6, upper: 0.7}},
            layerOpacityTimes: {lower: 2, upper: 4},
            indexOpacityRange: {bottom: {lower: 0.4, upper: 0.5}, top: {lower: 0.6, upper: 0.7}},
            indexOpacityTimes: {lower: 2, upper: 4},
            thickness: 2,
            stroke: 1,
            layerOpacity: 0.5,
            radius: {lower: 20, upper: 40},
            offsetRadius: {lower: 40, upper: 40},
            numberOfIndex: {lower: 13, upper: 13},
            startIndex: {lower: 8, upper: 8},
            initialNumberOfPoints: 8,
            scaleByFactor: 1.1,
            movementGaston: {lower: 4, upper: 8},
            accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 2, upper: 3}},
            blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes: {lower: 2, upper: 4},
        }),
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 0.25,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 300,
            length: 100,
            sparsityFactor: [3],
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
            layerOpacity: 0.25,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 450,
            length: 250,
            sparsityFactor: [1],
            center: {x: 1080 / 2, y: 1920 / 2},
            speed: {lower: 120, upper: 120},
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF')
        }),
        defaultEffectConfig: AmpConfig,
    })
});


await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            layerOpacityRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.7, upper: 0.8}},
            layerOpacityTimes: {lower: 1, upper: 2},
            indexOpacityRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.7, upper: 0.8}},
            indexOpacityTimes: {lower: 1, upper: 2},
            thickness: 1,
            stroke: 1,
            radius: {lower: 10, upper: 25},
            offsetRadius: {lower: 20, upper: 20},
            numberOfIndex: {lower: 10, upper: 10},
            startIndex: {lower: 5, upper: 5},
            initialNumberOfPoints: 6,
            scaleByFactor: 1.1,
            movementGaston: {lower: 1, upper: 4},
            accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
            blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
            featherTimes: {lower: 0, upper: 0},
        }),
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: LensFlareEffect,
        percentChance: 100,
        currentEffectConfig: new LensFlareConfig({
            numberOfFlareRings: new Range(30, 30),
            numberOfFlareRays: new Range(75, 75),
        }),
        possibleSecondaryEffects: [
            new LayerConfig({
                effect: GlowEffect,
                percentChance: 100,
                currentEffectConfig: new GlowConfig({
                    lowerRange: new Range(-24, -24),
                    upperRange: new Range(24, 24),
                    times: new Range(8, 8)
                })
            })
        ]
    })
});

const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

promiseArray.push(myTestProject.generateRandomLoop());
promiseArray.push(myTestProject.generateRandomLoop());
promiseArray.push(myTestProject.generateRandomLoop());

Promise.all(promiseArray);




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

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'the-advance',
    projectDirectory: "src/the-advance/",
    neutrals: ['#bbbbbb', '#cccccc', '#dddddd'],
    backgrounds: ['#000000']
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            color: new ColorPicker(),
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
            invertLayers: true,
            thickness: 2,
            circles: {lower: 5, upper: 5},
            radius: {
                lower: (finalSize) => finalSize.shortestSide * 0.25,
                upper: (finalSize) => finalSize.longestSide * 0.55
            }
        }),
        defaultEffectConfig: FuzzyBandConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: EncircledSpiralEffect,
        percentChance: 100,
        currentEffectConfig: new EncircledSpiralConfig({
            center: new Point2D(1080 / 2, 1920 / 2),
            numberOfRings: new Range(8, 8),
            minSequenceIndex: [10],
            numberOfSequenceElements: [2],
            sequencePixelConstant: new PercentageRange(new PercentageLongestSide(0.005), new PercentageLongestSide(0.005)),
            sparsityFactor: [45],

        }),
        defaultEffectConfig: EncircledSpiralConfig
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
            lineStart: 225,
            length: 100,
            sparsityFactor: [1],
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
        effect: LayeredHexEffect,
        percentChance: 100,
        currentEffectConfig: new LayeredHexConfig({
            radius: new Range(40, 60),
            offsetRadius: new Range(80, 90),
            stroke: 1,
            invertLayers: false,
            startIndex: new Range(2, 4),
            numberOfIndex: new Range(10, 12),
            movementGaston: new Range(8, 12),
            initialNumberOfPoints: 4,
        }),
        defaultEffectConfig: LayeredHexConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ImageOverlayEffect,
        percentChance: 100,
        currentEffectConfig: new ImageOverlayConfig({
            layerOpacity: [1],
            buffer: [600],
        }),
        defaultEffectConfig: LayeredHexConfig,
        possibleSecondaryEffects: [
            new LayerConfig({
                effect:  GlowEffect,
                percentChance:100,
                currentEffectConfig: new GlowConfig({
                    lowerRange: new Range(-24,-24),
                    upperRange: new Range(24,24),
                    times: new Range(8,8)
                })
            })
        ]
    })
});

const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
promiseArray.push(myTestProject.generateRandomLoop());

Promise.all(promiseArray);




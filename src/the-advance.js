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
    neutrals: ['#888888', '#999999', '#aaaaaa'],
    backgrounds: ['#222222']
});

myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.blueNeons);

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            color: new ColorPicker(),
            innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
            invertLayers: true,
            thickness: 2,
            circles: {lower: 12, upper: 12},
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
        percentChance: 0,
        currentEffectConfig: new EncircledSpiralConfig({
            center: new Point2D(1080 / 2, 1920 / 2),
            numberOfRings: new Range(10, 10),
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
        effect: LensFlareEffect,
        percentChance: 100,
        currentEffectConfig: new LensFlareConfig({
            numberOfFlareRings: new Range(50, 10),
            numberOfFlareRays: new Range(75, 150),
            strategy: ['color-bucket']
        }),
        defaultEffectConfig: LensFlareConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: AmpEffect,
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 0.25,
            underLayerOpacity: 0.25,
            thickness: 1,
            lineStart: 150,
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
        percentChance: 0,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 0.25,
            underLayerOpacity: 0.25,
            thickness: 2,
            lineStart: 300,
            length: 100,
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
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 0.25,
            underLayerOpacity: 0.25,
            thickness: 3,
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
            layerOpacity: 1,
            sparsityFactor: [3, 4, 5],
            radiusFactor: new Range(0.2, 0.3),
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
            initialNumberOfPoints: 8,
        }),
        defaultEffectConfig: LayeredHexConfig
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ViewportEffect,
        percentChance: 0,
        currentEffectConfig: new ViewportConfig({
            invertLayers: true,
            underLayerOpacity: 0.95,
            thickness: 8,
            stroke: 2,
            layerOpacity: 0.5,
            amplitude: {lower: 0, upper: 0},
            radius: [300]
        }),
        defaultEffectConfig: ViewportConfig,
        possibleSecondaryEffects: []
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: MappedFramesEffect,
        percentChance: 100,
        currentEffectConfig: new MappedFramesConfig({
            layerOpacity: .6,
            buffer: [0],
            loopTimes: 12,
        }),
        defaultEffectConfig: MappedFramesConfig,
        possibleSecondaryEffects: []
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ImageOverlayEffect,
        percentChance: 0,
        currentEffectConfig: new ImageOverlayConfig({
            layerOpacity: [1],
            buffer: [1],
        }),
        defaultEffectConfig: ImageOverlayConfig,
        possibleSecondaryEffects: []
    })
});

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: ViewportEffect,
        percentChance: 0,
        currentEffectConfig: new ViewportConfig({
            invertLayers: true,
            underLayerOpacity: 0.95,
            thickness: 8,
            stroke: 2,
            layerOpacity: 0.5,
            amplitude: {lower: 150, upper: 150},
            radius: [300]
        }),
        defaultEffectConfig: ViewportConfig,
        possibleSecondaryEffects: []
    })
});


const promiseArray = [];
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
promiseArray.push(myTestProject.generateRandomLoop());

myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
promiseArray.push(myTestProject.generateRandomLoop());

myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);
promiseArray.push(myTestProject.generateRandomLoop());

Promise.all(promiseArray);




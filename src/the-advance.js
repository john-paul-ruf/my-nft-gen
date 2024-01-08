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

const myTestProject = new Project({
    artist: 'John Ruf',
    projectName: 'the-advance',
    projectDirectory: "src/the-advance/",
    neutrals: ['#000000']
});

myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.greenNeons);

const color = myTestProject.colorScheme.getColorFromBucket();
const points = [];
const smallGroupRadius = 0.3;
const innerRadius = 0.35
const ripple = 0.05
const radius = (innerRadius/2) * myTestProject.longestSideInPixels;
const increment = 360 / 6;
for (let i = 0; i < 360; i = i + increment) {
    points.push(findPointByAngleAndCircle(new Point2D(myTestProject.shortestSideInPixels / 2, myTestProject.longestSideInPixels / 2), ((increment + 1) * i + 30) % 360, radius));
}

for (let i = 0; i < points.length; i++) {
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzyRipplesEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzyRipplesConfig({
                outerColor: new ColorPicker(ColorPicker.SelectionType.color, color),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                thickness: 1,
                stroke: 2,
                center: points[i],
                largeNumberOfRings: new Range(0, 0,),
                smallNumberOfRings: new Range(8, 8,),
                layerOpacity: 0.75,
                underLayerOpacity: 0.55,
                largeRadius: new PercentageRange(new PercentageLongestSide(innerRadius), new PercentageLongestSide(innerRadius)),
                smallRadius: new PercentageRange(new PercentageLongestSide(smallGroupRadius), new PercentageLongestSide(smallGroupRadius)),
                ripple: new PercentageRange(new PercentageLongestSide(ripple), new PercentageLongestSide(ripple)),
                times: new Range(3,3),
            }),
            defaultEffectConfig: FuzzyRipplesConfig
        })
    });
}

await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
        effect: FuzzyBandEffect,
        percentChance: 100,
        currentEffectConfig: new FuzzyBandConfig({
            color: new ColorPicker(),
            innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            invertLayers: true,
            thickness: 12,
            circles: {lower: 10, upper: 10},
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
        effect: AmpEffect,
        percentChance: 100,
        currentEffectConfig: new AmpConfig({
            layerOpacity: 0.5,
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
            invertLayers: true,
            underLayerOpacity: 0.5,
            thickness: 26,
            stroke: 6,
            layerOpacity: 0.5,
            amplitude: {lower: 50, upper: 50},
            radius: [500]
        }),
        defaultEffectConfig: ViewportConfig,
        possibleSecondaryEffects:[
            new LayerConfig(({
                effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
                percentChance: 100,
                defaultEffectConfig: SingleLayerGlitchDrumrollHorizontalWaveConfig,
                currentEffectConfig: new SingleLayerGlitchDrumrollHorizontalWaveConfig({
                    glitchOffset: new Range(120,120),
                    glitchOffsetTimes: new Range(1,1),
                    cosineFactor: new Range(8,8)
                })
            }))
        ]
    })
});


await myTestProject.generateRandomLoop();




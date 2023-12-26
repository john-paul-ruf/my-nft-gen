import {Settings} from "./core/Settings.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import parseArgs from "minimist";
import {randomId} from "./core/math/random.js";
import {fuzzBandsEffect} from "./effects/primaryEffects/fuzzBands/effect.js";
import {encircledSpiralEffect} from "./effects/primaryEffects/encircledSpiral/effect.js";
import {layeredHexEffect} from "./effects/primaryEffects/layeredHex/effect.js";
import {ampEffect} from "./effects/primaryEffects/amp/effect.js";
import {lensFlareEffect} from "./effects/primaryEffects/lensFlare/effect.js";
import {viewportEffect} from "./effects/primaryEffects/viewport/effect.js";
import {scopesEffect} from "./effects/primaryEffects/scopes/effect.js";
import {randomizeEffect} from "./effects/secondaryEffects/randomize/effect.js";
import {glowEffect} from "./effects/secondaryEffects/glow/effect.js";
import {fadeEffect} from "./effects/secondaryEffects/fade/effect.js";
import {singleLayerBlurEffect} from "./effects/secondaryEffects/single-layer-blur/effect.js";
import {singleLayerGlitchFractalEffect} from "./effects/secondaryEffects/single-layer-glitch-fractal/effect.js";
import {
    singleLayerGlitchDrumrollHorizontalWaveEffect
} from "./effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/effect.js";
import {blurEffect} from "./effects/finalImageEffects/blur/effect.js";
import {pixelateEffect} from "./effects/finalImageEffects/pixelate/effect.js";
import {glitchInverseEffect} from "./effects/finalImageEffects/glitchInverse/effect.js";
import {glitchFractalEffect} from "./effects/finalImageEffects/glitchFractal/effect.js";
import {glitchDrumrollHorizontalWaveEffect} from "./effects/finalImageEffects/glitchDrumrollHorizontalWave/effect.js";
import {ColorScheme} from "./core/color/ColorScheme.js";
import {animateBackgroundEffect} from "./effects/primaryEffects/animateBackground/effect.js";
import {hexEffect} from "./effects/primaryEffects/hex/effect.js";
import {invertedRayRingEffect} from "./effects/primaryEffects/invertedRayRing/effect.js";
import {rayRingEffect} from "./effects/primaryEffects/rayRing/effect.js";
import {wireframeSpiralEffect} from "./effects/primaryEffects/wireframeSpiral/effect.js";
import {layeredRingsEffect} from "./effects/primaryEffects/layeredRings/effect.js";
import {nthRingsEffect} from "./effects/primaryEffects/nthRings/effect.js";
import {eightEffect} from "./effects/primaryEffects/eight/effect.js";
import {fuzzyRippleEffect} from "./effects/primaryEffects/fuzzyRipples/effect.js";
import {blinkOnEffect} from "./effects/primaryEffects/blink-on-blink-on-blink-redux/effect.js";
import {gatesEffect} from "./effects/primaryEffects/gates/effect.js";
import {threeDimensionalShapeEffect} from "./effects/primaryEffects/threeDimensionalShape/effect.js";
import {mappedFramesEffect} from "./effects/primaryEffects/mappedFrames/effect.js";
import {threeDimensionalRingsEffect} from "./effects/primaryEffects/threeDeminsonalRings/effect.js";
import {imageOverlayEffect} from "./effects/primaryEffects/imageOverlay/effect.js";
import {porousEffect} from "./effects/primaryEffects/porous/effect.js";
import {verticalScanLinesEffect} from "./effects/primaryEffects/scanLines/effect.js";
import {SettingsFactory} from "./core/SettingsFactory.js";

//how many you want to print?
const argv = parseArgs(process.argv)
const batchAmount = argv.hasOwnProperty('batchAmount') ? parseInt(argv.batchAmount) : -1;

if (batchAmount > 0) {
    async function CreateLoop() {
        ////////////////////////////////////////////////
        // Don't like the bluePlateSpecial?
        // Try customizing the everythingBagel to see what
        // pretties you can create!
        ////////////////////////////////////////////////
        //const settings = new Settings(bluePlateSpecial);
        const settings = new Settings(await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.everythingBagel}));
        const loopBuilder = new LoopBuilder(settings);
        return loopBuilder.constructLoop();
    }

    const promiseArray = []

    for (let i = 0; i < batchAmount; i++) {
        promiseArray.push(CreateLoop());
    }

    Promise.all(promiseArray).then(() => {
        //end
    });
}
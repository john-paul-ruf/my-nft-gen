import { ColorScheme } from './color/ColorScheme.js'
import { NeonColorScheme, NeonColorSchemeFactory } from './color/NeonColorSchemeFactory.js'
import { RayRingInvertedEffect } from '../effects/primaryEffects/rayRingInverted/RayRingInvertedEffect.js'
import { GlitchFractalEffect } from '../effects/finalImageEffects/glitchFractal/GlitchFractalEffect.js'
import { HexEffect } from '../effects/primaryEffects/hex/HexEffect.js'
import { AnimateBackgroundEffect } from '../effects/primaryEffects/animateBackground/AnimateBackgroundEffect.js'
import { RayRingEffect } from '../effects/primaryEffects/rayRing/RayRingEffect.js'
import { WireFrameSpiralEffect } from '../effects/primaryEffects/wireframeSpiral/WireFrameSpiralEffect.js'
import { FuzzyBandEffect } from '../effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js'
import { EncircledSpiralEffect } from '../effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js'
import { LayeredHexEffect } from '../effects/primaryEffects/layeredHex/LayeredHexEffect.js'
import { LayeredRingEffect } from '../effects/primaryEffects/layeredRing/LayeredRingEffect.js'
import { EightEffect } from '../effects/primaryEffects/eight/EightEffect.js'
import { FuzzyRipplesEffect } from '../effects/primaryEffects/fuzzyRipples/FuzzyRipplesEffect.js'
import { NthRingsEffect } from '../effects/primaryEffects/nthRings/NthRingsEffect.js'
import { AmpEffect } from '../effects/primaryEffects/amp/AmpEffect.js'
import { ScopesEffect } from '../effects/primaryEffects/scopes/ScopesEffect.js'
import { BlinkOnEffect } from '../effects/primaryEffects/blink-on-blink-on-blink-redux/BlinkEffect.js'
import { GatesEffect } from '../effects/primaryEffects/gates/GatesEffect.js'
import { LensFlareEffect } from '../effects/primaryEffects/lensFlare/LensFlareEffect.js'
import { ViewportEffect } from '../effects/primaryEffects/viewport/ViewportEffect.js'
import {
  ThreeDimensionalShapeEffect
} from '../effects/primaryEffects/threeDimensionalShape/ThreeDimensionalShapeEffect.js'
import { MappedFramesEffect } from '../effects/primaryEffects/mappedFrames/MappedFramesEffect.js'
import {
  ThreeDimensionalRingsEffect
} from '../effects/primaryEffects/threeDimensionalRings/ThreeDimensionalRingsEffect.js'
import { PorousEffect } from '../effects/primaryEffects/porous/PorousEffect.js'
import { ImageOverlayEffect } from '../effects/primaryEffects/imageOverlay/ImageOverlayEffect.js'
import { ScanLinesEffect } from '../effects/primaryEffects/scanLines/ScanLinesEffect.js'
import {
  SingleLayerGlitchDrumrollHorizontalWaveEffect
} from '../effects/secondaryEffects/single-layer-glitch-drumroll-horizontal-wave/SingleLayerGlitchDrumrollHorizontalWaveEffect.js'
import {
  SingleLayerGlitchFractalEffect
} from '../effects/secondaryEffects/single-layer-glitch-fractal/SingleLayerGlitchFractalEffect.js'
import { SingleLayerBlurEffect } from '../effects/secondaryEffects/single-layer-blur/SingleLayerBlurEffect.js'
import { FadeEffect } from '../effects/secondaryEffects/fade/FadeEffect.js'
import { GlowEffect } from '../effects/secondaryEffects/glow/GlowEffect.js'
import { RandomizeEffect } from '../effects/secondaryEffects/randomize/RandomizeEffect.js'
import { BlurEffect } from '../effects/finalImageEffects/blur/BlurEffect.js'
import { PixelateEffect } from '../effects/finalImageEffects/pixelate/PixelateEffect.js'
import { GlitchInverseEffect } from '../effects/finalImageEffects/glitchInverse/GlitchInverseEffect.js'
import {
  GlitchDrumrollHorizontalWaveEffect
} from '../effects/finalImageEffects/glitchDrumrollHorizontalWave/GlitchDrumrollHorizontalWaveEffect.js'
import { randomId } from './math/random.js'
import { Settings } from './Settings.js'

export class SettingsFactory {
  static AvailableSettings = {
    experimental: 'experimental',
    bluePlateSpecial: 'blue-plate-special',
    everythingBagel: 'everything-bagel'
  }

  static getPresetSetting = async ({ request = SettingsFactory.AvailableSettings.bluePlateSpecial }) => {
    switch (request) {
      case SettingsFactory.AvailableSettings.experimental:

        return new Settings({
          colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
          // colorScheme: ColorSchemeJsFactory.getColorSchemeJsColorScheme({}),
          neutrals: ['#FFFFFF'],
          backgrounds: ['#000000'],
          lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
          _INVOKER_: 'John Ruf',
          runName: 'neon-dreams',
          frameInc: 1,
          numberOfFrame: 1800,
          finalFileName: 'neon-dream' + randomId(),
          allPrimaryEffects: [
            { Effect: LensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false }
          ]
        })
      case SettingsFactory.AvailableSettings.bluePlateSpecial:
        return new Settings({
          colorScheme: NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons),
          // colorScheme: ColorSchemeJsFactory.getColorSchemeJsColorScheme({}),
          neutrals: ['#FFFFFF'],
          backgrounds: ['#000000'],
          lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
          _INVOKER_: 'John Ruf',
          runName: 'neon-dreams',
          frameInc: 1,
          numberOfFrame: 1800,
          finalFileName: 'neon-dream' + randomId(),
          allPrimaryEffects: [
            { Effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: NthRingsEffect, effectChance: 50, ignoreAdditionalEffects: false },
            { Effect: AmpEffect, effectChance: 50, ignoreAdditionalEffects: false },
            { Effect: LayeredHexEffect, effectChance: 50, ignoreAdditionalEffects: false },
            { Effect: ScopesEffect, effectChance: 50, ignoreAdditionalEffects: false },
            { Effect: EncircledSpiralEffect, effectChance: 50, ignoreAdditionalEffects: false },
            { Effect: ViewportEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ImageOverlayEffect, effectChance: 50, ignoreAdditionalEffects: false }
          ]
        })
      case SettingsFactory.AvailableSettings.everythingBagel:
        return new Settings({
          colorScheme: new ColorScheme(NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons)),
          neutrals: ['#FFFFFF'],
          backgrounds: ['#000000'],
          lights: ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
          _INVOKER_: 'the guy who never tests enough',
          runName: 'be-prepared-to-wait',
          frameInc: 1,
          numberOfFrame: 1,
          finalFileName: 'test-run' + randomId(),
          allPrimaryEffects: [
            { Effect: AnimateBackgroundEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: HexEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: RayRingInvertedEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: RayRingEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: WireFrameSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: FuzzyBandEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: EncircledSpiralEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: LayeredHexEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: LayeredRingEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: NthRingsEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: EightEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: FuzzyRipplesEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: AmpEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ScopesEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: BlinkOnEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: GatesEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: LensFlareEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ViewportEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ThreeDimensionalShapeEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: MappedFramesEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ThreeDimensionalRingsEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ImageOverlayEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: PorousEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: ScanLinesEffect, effectChance: 100, ignoreAdditionalEffects: false }
          ],
          allSecondaryEffects: [
            { Effect: RandomizeEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: GlowEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: FadeEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: SingleLayerBlurEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: SingleLayerGlitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false },
            {
              Effect: SingleLayerGlitchDrumrollHorizontalWaveEffect,
              effectChance: 100,
              ignoreAdditionalEffects: false
            }
          ],
          allFinalImageEffects: [
            { Effect: BlurEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: PixelateEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: GlitchInverseEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: GlitchFractalEffect, effectChance: 100, ignoreAdditionalEffects: false },
            { Effect: GlitchDrumrollHorizontalWaveEffect, effectChance: 100, ignoreAdditionalEffects: false }
          ]
        })
      default:
        throw new Error('Not a valid settings enum')
    }
  }
}

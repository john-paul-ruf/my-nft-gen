import { Project } from './app/Project.js'
import { LayerConfig } from './core/layer/LayerConfig.js'
import { NeonColorScheme, NeonColorSchemeFactory } from './core/color/NeonColorSchemeFactory.js'
import { ColorPicker } from './core/layer/configType/ColorPicker.js'
import { RedEyeEffect } from './effects/primaryEffects/red-eye/RedEyeEffect.js'
import { Point2D } from './core/layer/configType/Point2D.js'
import { RedEyeConfig } from './effects/primaryEffects/red-eye/RedEyeConfig.js'
import { MappedFramesEffect } from './effects/primaryEffects/mappedFrames/MappedFramesEffect.js'
import { MappedFramesConfig } from './effects/primaryEffects/mappedFrames/MappedFramesConfig.js'
import { FuzzyBandEffect } from './effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js'
import { FuzzyBandConfig } from './effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js'
import { getRandomFromArray, getRandomIntInclusive } from './core/math/random.js'
import { ScopesEffect } from './effects/primaryEffects/scopes/ScopesEffect.js'
import { ScopesConfig } from './effects/primaryEffects/scopes/ScopesConfig.js'

const myTestProject = new Project({
  artist: 'John Ruf',
  projectName: 'red-eye',
  projectDirectory: 'src/red-eye/',
  neutrals: ['#FFFFFF'],
  backgrounds: ['#000000'],
  numberOfFrame: 1800
})

await myTestProject.addPrimaryEffect({
  layerConfig: new LayerConfig({
    Effect: ScopesEffect,
    percentChance: 100,
    currentEffectConfig: new ScopesConfig({
      layerOpacity: 1,
      sparsityFactor: [4, 5, 6],
      gapFactor: { lower: 0.2, upper: 0.4 },
      radiusFactor: { lower: 0.1, upper: 0.2 },
      scaleFactor: 1.2,
      alphaRange: { bottom: { lower: 0.3, upper: 0.5 }, top: { lower: 0.8, upper: 1 } },
      alphaTimes: { lower: 2, upper: 8 },
      rotationTimes: { lower: 0, upper: 0 },
      numberOfScopesInALine: 20
    }),
    defaultEffectConfig: ScopesConfig
  })
})

await myTestProject.addPrimaryEffect({
  layerConfig: new LayerConfig({
    Effect: FuzzyBandEffect,
    percentChance: 100,
    currentEffectConfig: new FuzzyBandConfig({
      layerOpacity: 0.70,
      underLayerOpacityRange: { bottom: { lower: 0.4, upper: 0.5 }, top: { lower: 0.6, upper: 0.7 } },
      underLayerOpacityTimes: { lower: 2, upper: 8 },
      color: new ColorPicker(),
      innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
      invertLayers: true,
      thickness: 1,
      stroke: 1,
      circles: { lower: 4, upper: 4 },
      radius: {
        lower: (finalSize) => finalSize.shortestSide * 0.2,
        upper: (finalSize) => finalSize.shortestSide * 0.45
      },
      accentRange: { bottom: { lower: 20, upper: 20 }, top: { lower: 28, upper: 28 } },
      blurRange: { bottom: { lower: 10, upper: 10 }, top: { lower: 14, upper: 14 } },
      featherTimes: { lower: 2, upper: 8 }
    }),
    defaultEffectConfig: FuzzyBandConfig
  })
})

await myTestProject.addPrimaryEffect({
  layerConfig: new LayerConfig({
    Effect: MappedFramesEffect,
    percentChance: 100,
    currentEffectConfig: new MappedFramesConfig({
      folderName: '/mappedFrames/',
      layerOpacity: [0.85],
      buffer: [600],
      loopTimes: 15
    })
  })
})

const redEyeCount = getRandomFromArray([8])

for (let i = 0; i < redEyeCount; i++) {
  await myTestProject.addPrimaryEffect({
    layerConfig: new LayerConfig({
      Effect: RedEyeEffect,
      percentChance: 100,
      currentEffectConfig: new RedEyeConfig({
        invertLayers: true,
        layerOpacity: 0.7,
        underLayerOpacity: 0.5,
        center: new Point2D(1080 / 2, 1920 / 2),
        innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
        outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
        stroke: 1,
        thickness: 1,
        sparsityFactor: [4, 5, 6, 8, 9, 10],
        innerRadius: getRandomIntInclusive(50, 350),
        outerRadius: getRandomIntInclusive(550, 750),
        possibleJumpRangeInPixels: { lower: 5, upper: 25 },
        lineLength: { lower: 75, upper: 150 },
        numberOfLoops: { lower: 1, upper: 4 },
        accentRange: { bottom: { lower: 4, upper: 4 }, top: { lower: 8, upper: 8 } },
        blurRange: { bottom: { lower: 3, upper: 3 }, top: { lower: 6, upper: 6 } },
        featherTimes: { lower: 2, upper: 8 }
      })
    })
  })
}

const promiseArray = []
myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons)

promiseArray.push(myTestProject.generateRandomLoop())

await Promise.all(promiseArray)

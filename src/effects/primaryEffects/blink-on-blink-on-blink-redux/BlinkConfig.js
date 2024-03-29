import { EffectConfig } from '../../../core/layer/EffectConfig.js'

export class BlinkConfig extends EffectConfig {
  constructor (
    {
      layerOpacity = 0.75,
      numberOfBlinks = { lower: 1, upper: 2 },
      initialRotation = { lower: 0, upper: 360 },
      rotationSpeedRange = { lower: 1, upper: 2 },
      counterClockwise = { lower: 0, upper: 1 },
      diameterRange = {
        lower: (finalSize) => finalSize.shortestSide * 0.25,
        upper: (finalSize) => finalSize.longestSide * 0.8
      },
      glowLowerRange = { lower: -128, upper: -64 },
      glowUpperRange = { lower: 64, upper: 128 },
      glowTimes = { lower: 2, upper: 4 },
      randomizeSpin = { lower: -64, upper: 64 },
      randomizeRed = { lower: -64, upper: 64 },
      randomizeBlue = { lower: -64, upper: 64 },
      randomizeGreen = { lower: -64, upper: 64 }
    }
  ) {
    super()
    this.layerOpacity = layerOpacity
    this.numberOfBlinks = numberOfBlinks
    this.initialRotation = initialRotation
    this.rotationSpeedRange = rotationSpeedRange
    this.counterClockwise = counterClockwise
    this.diameterRange = diameterRange
    this.glowLowerRange = glowLowerRange
    this.glowUpperRange = glowUpperRange
    this.glowTimes = glowTimes
    this.randomizeSpin = randomizeSpin
    this.randomizeRed = randomizeRed
    this.randomizeBlue = randomizeBlue
    this.randomizeGreen = randomizeGreen
  }
}

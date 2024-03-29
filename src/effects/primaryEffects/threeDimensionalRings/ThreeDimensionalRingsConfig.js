import { EffectConfig } from '../../../core/layer/EffectConfig.js'

export class ThreeDimensionalRingsConfig extends EffectConfig {
  constructor (
    {
      rings = { lower: 10, upper: 15 },
      ringRadius = { lower: 0.1, upper: 0.2 },
      ringGap = { lower: 5, upper: 10 },
      radiusConstant = 50,
      times = { lower: 1, upper: 6 },
      height = { lower: 5, upper: 10 },
      ringOpacity = { lower: 0.3, upper: 0.5 }
    }
  ) {
    super()
    this.rings = rings
    this.ringRadius = ringRadius
    this.ringGap = ringGap
    this.radiusConstant = radiusConstant
    this.times = times
    this.height = height
    this.ringOpacity = ringOpacity
  }
}

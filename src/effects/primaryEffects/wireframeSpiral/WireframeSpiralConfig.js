import { EffectConfig } from '../../../core/layer/EffectConfig.js'

export class WireframeSpiralConfig extends EffectConfig {
  constructor (
    {
      layerOpacity = 0.4,
      underLayerOpacityRange = { bottom: { lower: 0.3, upper: 0.35 }, top: { lower: 0.4, upper: 0.45 } },
      underLayerOpacityTimes = { lower: 1, upper: 6 },
      startTwistCount = { lower: 1, upper: 2 },
      stroke = [0],
      thickness = [1, 2, 3],
      sparsityFactor = [30, 36, 40, 45, 60],
      speed = { lower: 4, upper: 8 },
      counterClockwise = { lower: 0, upper: 1 },
      unitLength = { lower: 2, upper: 6 },
      unitLengthChangeConstant = [2, 4, 8],
      radiusConstant = [50, 75, 150],
      accentRange = { bottom: { lower: 0, upper: 1 }, top: { lower: 0, upper: 0 } },
      blurRange = { bottom: { lower: 0, upper: 0 }, top: { lower: 0, upper: 0 } },
      featherTimes = { lower: 0, upper: 0 }
    }
  ) {
    super()
    this.layerOpacity = layerOpacity
    this.underLayerOpacityRange = underLayerOpacityRange
    this.underLayerOpacityTimes = underLayerOpacityTimes
    this.startTwistCount = startTwistCount
    this.stroke = stroke
    this.thickness = thickness
    this.sparsityFactor = sparsityFactor
    this.speed = speed
    this.counterClockwise = counterClockwise
    this.unitLength = unitLength
    this.unitLengthChangeConstant = unitLengthChangeConstant
    this.radiusConstant = radiusConstant
    this.accentRange = accentRange
    this.blurRange = blurRange
    this.featherTimes = featherTimes
  }
}

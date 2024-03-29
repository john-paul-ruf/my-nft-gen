import { EffectConfig } from '../../../core/layer/EffectConfig.js'

export class ViewportConfig extends EffectConfig {
  constructor (
    {
      invertLayers = true,
      layerOpacity = 1,
      underLayerOpacity = 0.8,
      stroke = 2,
      thickness = 18,
      ampStroke = 0,
      ampThickness = 1,
      radius = [350],
      startAngle = [270],
      ampLength = [50, 75, 100],
      ampRadius = [50, 75, 100],
      sparsityFactor = [3, 4, 5, 6],
      amplitude = { lower: 150, upper: 150 },
      times = { lower: 1, upper: 2 },
      accentRange = { bottom: { lower: 0, upper: 0 }, top: { lower: 20, upper: 30 } },
      blurRange = { bottom: { lower: 2, upper: 3 }, top: { lower: 5, upper: 8 } },
      featherTimes = { lower: 2, upper: 4 }
    }
  ) {
    super()
    this.invertLayers = invertLayers
    this.layerOpacity = layerOpacity
    this.underLayerOpacity = underLayerOpacity
    this.stroke = stroke
    this.thickness = thickness
    this.ampStroke = ampStroke
    this.ampThickness = ampThickness
    this.radius = radius
    this.startAngle = startAngle
    this.ampLength = ampLength
    this.ampRadius = ampRadius
    this.sparsityFactor = sparsityFactor
    this.amplitude = amplitude
    this.times = times
    this.accentRange = accentRange
    this.blurRange = blurRange
    this.featherTimes = featherTimes
  }
}

import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { Point2D } from '../../../core/layer/configType/Point2D.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';

export class EncircledSpiralConfig extends EffectConfig {
  constructor(
    {
      invertLayers = true,
      layerOpacity = 0.55,
      underLayerOpacity = 0.5,
      startAngle = { lower: 0, upper: 360 },
      numberOfRings = { lower: 20, upper: 20 },
      stroke = 1,
      thickness = 2,
      sparsityFactor = [60],
      sequencePixelConstant = {
        lower: (finalSize) => finalSize.shortestSide * 0.001,
        upper: (finalSize) => finalSize.shortestSide * 0.001,
      },
      sequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
      minSequenceIndex = [12],
      numberOfSequenceElements = [3],
      speed = { lower: 2, upper: 2 },
      accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
      blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
      featherTimes = { lower: 2, upper: 4 },
      center = new Point2D(1080 / 2, 1920 / 2),
      innerColor = new ColorPicker(ColorPicker.SelectionType.neutralBucket),
      outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
    },
  ) {
    super();
    this.invertLayers = invertLayers;
    this.layerOpacity = layerOpacity;
    this.underLayerOpacity = underLayerOpacity;
    this.startAngle = startAngle;
    this.numberOfRings = numberOfRings;
    this.stroke = stroke;
    this.thickness = thickness;
    this.sparsityFactor = sparsityFactor;
    this.sequencePixelConstant = sequencePixelConstant;
    this.sequence = sequence;
    this.minSequenceIndex = minSequenceIndex;
    this.numberOfSequenceElements = numberOfSequenceElements;
    this.speed = speed;
    this.accentRange = accentRange;
    this.blurRange = blurRange;
    this.featherTimes = featherTimes;
    this.center = center;
    this.innerColor = innerColor;
    this.outerColor = outerColor;
  }
}

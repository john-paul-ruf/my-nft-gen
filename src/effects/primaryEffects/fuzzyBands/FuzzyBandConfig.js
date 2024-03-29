import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';

export class FuzzyBandConfig extends EffectConfig {
    constructor(
        {
            color = new ColorPicker(),
            innerColor = new ColorPicker(),
            invertLayers = true,
            layerOpacity = 1,
            underLayerOpacityRange = { bottom: { lower: 0.7, upper: 0.8 }, top: { lower: 0.9, upper: 0.95 } },
            underLayerOpacityTimes = { lower: 2, upper: 6 },
            circles = { lower: 6, upper: 10 },
            stroke = 0,
            thickness = 4,
            radius = {
                lower: (finalSize) => finalSize.shortestSide * 0.10,
                upper: (finalSize) => finalSize.longestSide * 0.45,
            },
            accentRange = { bottom: { lower: 6, upper: 12 }, top: { lower: 25, upper: 45 } },
            blurRange = { bottom: { lower: 1, upper: 3 }, top: { lower: 8, upper: 12 } },
            featherTimes = { lower: 2, upper: 6 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacityRange = underLayerOpacityRange;
        this.underLayerOpacityTimes = underLayerOpacityTimes;
        this.circles = circles;
        this.stroke = stroke;
        this.thickness = thickness;
        this.radius = radius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.color = color;
        this.innerColor = innerColor;
    }
}

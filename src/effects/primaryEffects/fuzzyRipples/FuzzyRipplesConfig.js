import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { Point2D } from '../../../core/layer/configType/Point2D.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';

export class FuzzyRipplesConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 1,
            underLayerOpacity = 0.8,
            stroke = 1,
            thickness = 2,
            center = new Point2D(1080 / 2, 1920 / 2),
            innerColor = new ColorPicker(),
            outerColor = new ColorPicker(),
            speed = 1,
            largeRadius = {
                lower: (finalSize) => finalSize.longestSide * 0.15,
                upper: (finalSize) => finalSize.longestSide * 0.15,
            },
            smallRadius = {
                lower: (finalSize) => finalSize.longestSide * 0.25,
                upper: (finalSize) => finalSize.longestSide * 0.25,
            },
            largeNumberOfRings = { lower: 8, upper: 8 },
            smallNumberOfRings = { lower: 8, upper: 8 },
            ripple = {
                lower: (finalSize) => finalSize.shortestSide * 0.10,
                upper: (finalSize) => finalSize.shortestSide * 0.10,
            },
            times = { lower: 2, upper: 4 },
            smallerRingsGroupRadius = {
                lower: (finalSize) => finalSize.shortestSide * 0.3,
                upper: (finalSize) => finalSize.shortestSide * 0.3,
            },
            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            featherTimes = { lower: 2, upper: 4 },
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.stroke = stroke;
        this.thickness = thickness;
        this.largeRadius = largeRadius;
        this.smallRadius = smallRadius;
        this.largeNumberOfRings = largeNumberOfRings;
        this.smallNumberOfRings = smallNumberOfRings;
        this.ripple = ripple;
        this.times = times;
        this.smallerRingsGroupRadius = smallerRingsGroupRadius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
        this.center = center;
        this.speed = speed;
    }
}

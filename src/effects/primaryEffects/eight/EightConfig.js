import {EffectConfig} from "../../../core/layer/EffectConfig.js";

export class EightConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.3,
            stroke = 1,
            thickness = 4,
            smallRadius = {
                lower: (finalSize) => finalSize.longestSide * 0.10,
                upper: (finalSize) => finalSize.longestSide * 0.15
            },
            smallNumberOfRings = {lower: 12, upper: 16},
            ripple = {
                lower: (finalSize) => finalSize.shortestSide * 0.05,
                upper: (finalSize) => finalSize.shortestSide * 0.10
            },
            times = {lower: 2, upper: 4},
            smallerRingsGroupRadius = {
                lower: (finalSize) => finalSize.shortestSide * 0.25,
                upper: (finalSize) => finalSize.shortestSide * 0.30
            },
            accentRange = {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
            blurRange = {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 1}},
            featherTimes = {lower: 2, upper: 4},
        }
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.stroke = stroke;
        this.thickness = thickness;
        this.smallRadius = smallRadius;
        this.smallNumberOfRings = smallNumberOfRings;
        this.ripple = ripple;
        this.times = times;
        this.smallerRingsGroupRadius = smallerRingsGroupRadius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
    }
}
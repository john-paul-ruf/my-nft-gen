import {EffectConfig} from "../../../core/layer/EffectConfig.js";

export class AmpConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 0.55,
            underLayerOpacity = 0.5,
            sparsityFactor = [1, 2, 3,],
            stroke = 1,
            thickness = 1,
            accentRange = {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange = {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes = {lower: 2, upper: 4},
            speed = {lower: 24, upper: 36},
            length = 200,
            lineStart = 350,
            center = {x: 1080 / 2, y: 1920 / 2},
            innerColor = null,
            outerColor = null,
        }
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.sparsityFactor = sparsityFactor;
        this.stroke = stroke;
        this.thickness = thickness;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.speed = speed;
        this.length = length;
        this.lineStart = lineStart;
        this.center = center;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
    }
}
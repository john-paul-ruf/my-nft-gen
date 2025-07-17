import {EffectConfig} from '../../../core/layer/EffectConfig.js';

export class CRTShadowConfig extends EffectConfig {
    constructor(
        {
            shadowOpacityRange = {bottom: {lower: 0.6, upper: 0.6}, top: {lower: 0.8, upper: 0.8}},
            linesOpacityRange = {bottom: {lower: 0.3, upper: 0.3}, top: {lower: 0.5, upper: 0.5}},
            opacityTimes = {lower: 4, upper: 4},
            lineRed = {lower: 0, upper: 255},
            lineGreen = {lower: 0, upper: 255},
            lineBlue = {lower: 0, upper: 255},
            lineHeight = {lower: 0.5, upper: 4},
            edgePercentage= {lower: 0.15, upper: 0.15},
            maxLineHeight= {lower: 2.5, upper: 2.5},
            numberOfEdgeSections= {lower: 5, upper: 5},
        },
    ) {
        super();

        this.shadowOpacityRange = shadowOpacityRange;
        this.linesOpacityRange = linesOpacityRange;
        this.opacityTimes = opacityTimes;
        this.lineRed = lineRed;
        this.lineGreen = lineGreen;
        this.lineBlue = lineBlue;
        this.lineHeight = lineHeight;
        this.edgePercentage = edgePercentage;
        this.maxLineHeight = maxLineHeight;
        this.numberOfEdgeSections = numberOfEdgeSections;
    }
}

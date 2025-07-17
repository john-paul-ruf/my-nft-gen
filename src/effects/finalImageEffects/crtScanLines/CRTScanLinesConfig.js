import {EffectConfig} from '../../../core/layer/EffectConfig.js';

export class CRTScanLinesConfig extends EffectConfig {
    constructor(
        {
            lines = {lower: 8, upper: 12},
            loopTimes = {lower: 1, upper: 2},
            brightnessRange = {bottom: {lower: 5, upper: 10}, top: {lower: 15, upper: 30}},
            brightnessTimes = {lower: 2, upper: 8},
            thicknessRange  = {bottom: {lower: 2, upper: 4}, top: {lower: 6, upper: 8}},
            thicknessTimes = {lower: 2, upper: 8},
            lineBlurRange  = {bottom: {lower: 10, upper: 20}, top: {lower: 30, upper: 40}},
            lineBlurTimes = {lower: 2, upper: 8},
            colorTintRange = {
                redRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.7, upper: 0.8}},
                greenRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.7, upper: 0.8}},
                blueRange: {bottom: {lower: 1.0, upper: 1.25}, top: {lower: 1.5, upper: 2}},
            },
            colorTintTimes = {lower: 2, upper: 8},
            opacityRange = {bottom: {lower: 0.35, upper: 0.4}, top: {lower: 0.5, upper: 0.55}},
            opacityTimes = {lower: 2, upper: 8},
        },
    ) {
        super();
        this.lines = lines;
        this.loopTimes = loopTimes;
        this.brightnessRange = brightnessRange;
        this.brightnessTimes = brightnessTimes;
        this.thicknessRange = thicknessRange;
        this.thicknessTimes = thicknessTimes;
        this.lineBlurRange = lineBlurRange;
        this.lineBlurTimes = lineBlurTimes;
        this.colorTintRange = colorTintRange;
        this.colorTintTimes = colorTintTimes;
        this.opacityRange = opacityRange;
        this.opacityTimes = opacityTimes;
    }
}

import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

export class CRTShadowConfig extends EffectConfig {
    constructor(
        {
            shadowOpacityRange = {bottom: {lower: 0.6, upper: 0.6}, top: {lower: 0.8, upper: 0.8}},
            linesOpacityRange = {bottom: {lower: 0.3, upper: 0.3}, top: {lower: 0.5, upper: 0.5}},
            opacityTimes = {lower: 4, upper: 4},
            lineColorPicker = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            lineHeight = new Range(0.5, 4),
            edgePercentage= {lower: 0.15, upper: 0.15},
            maxLineHeight= {lower: 2.5, upper: 2.5},
            numberOfEdgeSections= {lower: 5, upper: 5},
        },
    ) {
        super();

        this.shadowOpacityRange = shadowOpacityRange;
        this.linesOpacityRange = linesOpacityRange;
        this.opacityTimes = opacityTimes;
        this.lineColorPicker = lineColorPicker;
        this.lineHeight = lineHeight;
        this.edgePercentage = edgePercentage;
        this.maxLineHeight = maxLineHeight;
        this.numberOfEdgeSections = numberOfEdgeSections;
    }
}

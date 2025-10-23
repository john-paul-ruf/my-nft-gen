import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";
import {ColorPicker} from "my-nft-gen/src/core/layer/configType/ColorPicker.js";

/** *
 *
 * Config for CRT Scan Lines Effect
 * Creates animated CRT scan lines for the composite image
 *
 * @lines - Range: number of scan lines
 * @loopTimes - Range: number of times to loop during total frame count
 * @brightnessRange - DynamicRange: brightness modulation range
 * @brightnessTimes - Range: number of brightness cycles
 * @thicknessRange - DynamicRange: line thickness range
 * @thicknessTimes - Range: number of thickness cycles
 * @lineBlurRange - DynamicRange: line blur amount range
 * @lineBlurTimes - Range: number of blur cycles
 * @colorTintRange - ColorPicker: color picker for scan line tinting
 * @opacityRange - DynamicRange: opacity modulation range
 * @opacityTimes - Range: number of opacity cycles
 * @direction - string: direction of scan lines ('up' or 'down')
 */
export class CRTScanLinesConfig extends EffectConfig {
    constructor(
        {
            lines = new Range(8, 12),
            loopTimes = new Range(1, 2),
            brightnessRange = new DynamicRange(new Range(5, 10), new Range(15, 30)),
            brightnessTimes = new Range(2, 8),
            thicknessRange  = new DynamicRange(new Range(2, 4), new Range(6, 8)),
            thicknessTimes = new Range(2, 8),
            lineBlurRange  = new DynamicRange(new Range(10, 20), new Range(30, 40)),
            lineBlurTimes = new Range(2, 8),
            colorTintRange = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            opacityRange = new DynamicRange(new Range(0.35, 0.4), new Range(0.5, 0.55)),
            opacityTimes = new Range(2, 8),
            direction= 'down', //'up','down;
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
        this.opacityRange = opacityRange;
        this.opacityTimes = opacityTimes;
        this.direction = direction;
    }
}

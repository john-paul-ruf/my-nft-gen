import {EffectConfig} from '../../../core/layer/EffectConfig.js';

/**
 * Config for AnimatedCrossProcessEffect
 * Simulates film cross-processing with animated hue shifts.
 *
 * @hueShiftRange - minimum and maximum hue shift in degrees
 * @contrast - range for image contrast adjustment (-1 to 1)
 * @cycleSpeed - number of hue oscillation cycles over total frames
 */
export class AnimatedCrossProcessConfig extends EffectConfig {
    constructor({
        hueShiftRange = { lower: -30, upper: 30 },
        contrast = { lower: 0, upper: 0.4 },
        cycleSpeed = { lower: 1, upper: 3 },
    } = {}) {
        super();
        this.hueShiftRange = hueShiftRange;
        this.contrast = contrast;
        this.cycleSpeed = cycleSpeed;
    }
}

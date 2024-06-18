import { EffectConfig } from '../../../core/layer/EffectConfig.js';

/** *
 *
 * Config for BlinkOn Effect. Creates layers of blink.png. Each blink can have the colors randomized and a glow effect applied
 *
 * @layerOpacity - The opacity of each blink
 * @numberOfBlinks - Range: the number of blinks to layer
 * @initialRotation - Range: rotate the blink x angle
 * @rotationSpeedRange - Range: how many times to rotate the blink over the number of frames
 * @diameterRange - PercentageRange: the diameter range for each blink
 * @glowLowerRange - Range: lower glow range
 * @glowUpperRange - Range: upper glow range
 * @glowTimes - Range: number of times to glow over the number of frames
 * @randomizeSpin - Range: hue spin
 * @randomizeRed - Range: increase or decrease the red
 * @randomizeBlue - Range: increase or decrease the blue
 * @randomizeGreen - Range: increase or decrease the green
 *
 */

export class BlinkOnConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 0.75,
            numberOfBlinks = { lower: 1, upper: 2 },
            initialRotation = { lower: 0, upper: 360 },
            rotationSpeedRange = { lower: 1, upper: 2 },
            diameterRange = {
                lower: (finalSize) => finalSize.shortestSide * 0.25,
                upper: (finalSize) => finalSize.longestSide * 0.8,
            },
            glowLowerRange = { lower: -128, upper: -64 },
            glowUpperRange = { lower: 64, upper: 128 },
            glowTimes = { lower: 2, upper: 4 },
            randomizeSpin = { lower: -64, upper: 64 },
            randomizeRed = { lower: -64, upper: 64 },
            randomizeBlue = { lower: -64, upper: 64 },
            randomizeGreen = { lower: -64, upper: 64 },
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.numberOfBlinks = numberOfBlinks;
        this.initialRotation = initialRotation;
        this.rotationSpeedRange = rotationSpeedRange;
        this.diameterRange = diameterRange;
        this.glowLowerRange = glowLowerRange;
        this.glowUpperRange = glowUpperRange;
        this.glowTimes = glowTimes;
        this.randomizeSpin = randomizeSpin;
        this.randomizeRed = randomizeRed;
        this.randomizeBlue = randomizeBlue;
        this.randomizeGreen = randomizeGreen;
    }
}

import {EffectConfig} from '../../../core/layer/EffectConfig.js';

/**
 * Configuration for PerlinNoiseEffect
 * @param scale - base frequency of the noise (0-1)
 * @param speed - amount to change noise seed per frame
 * @param colorScheme - [lowColor, highColor] hex color array
 */
export class PerlinNoiseConfig extends EffectConfig {
    constructor({
                    scale = 0.02,
                    speed = 1,
                    colorScheme = ['#000000', '#ffffff'],
                } = {}) {
        super();
        this.scale = scale;
        this.speed = speed;
        this.colorScheme = colorScheme;
    }
}

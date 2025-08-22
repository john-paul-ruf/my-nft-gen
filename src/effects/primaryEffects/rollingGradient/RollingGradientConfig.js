import {EffectConfig} from '../../../core/layer/EffectConfig.js';
import {Range} from '../../../core/layer/configType/Range.js';

/**
 * Config for Rolling Gradient Effect
 * Creates a gradient that rolls through colors over time
 *
 * @colorStops - Array of [y percentage (0-1), hex color string] defining gradient stops
 * @loopTimes - Range: number of times the gradient should loop through its animation
 * @direction - String: direction of gradient movement ('up', 'down')
 */

export class RollingGradientConfig extends EffectConfig {
    constructor(
        {
            colorStops = [
                [0, '#ff0000'],
                [0.5, '#00ff00'],
                [1, '#0000ff']
            ],
            loopTimes = {lower: 1, upper: 3},
            direction = 'down',
        },
    ) {
        super();
        this.colorStops = colorStops;
        this.loopTimes = loopTimes;
        this.direction = direction;
    }
}
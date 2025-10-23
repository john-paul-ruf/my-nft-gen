import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';

/**
 * Config for Rolling Gradient Effect
 * Creates a gradient that rolls through colors over time with seamless looping
 *
 * @color1 - ColorPicker: first gradient color
 * @color2 - ColorPicker: second gradient color
 * @color3 - ColorPicker: third gradient color (optional)
 * @color4 - ColorPicker: fourth gradient color (optional)
 * @color5 - ColorPicker: fifth gradient color (optional)
 * @position1 - number: position of first color (0-1)
 * @position2 - number: position of second color (0-1)
 * @position3 - number: position of third color (0-1, null to disable)
 * @position4 - number: position of fourth color (0-1, null to disable)
 * @position5 - number: position of fifth color (0-1, null to disable)
 * @loopTimes - Range: number of times the gradient should loop through its animation
 * @direction - String: direction of gradient movement ('up', 'down')
 * @layerOpacity - number: opacity of the gradient layer (0-1)
 */

export class RollingGradientConfig extends EffectConfig {
    constructor(
        {
            color1 = new ColorPicker(),
            color2 = new ColorPicker(),
            color3 = new ColorPicker(),
            color4 = new ColorPicker(),
            color5 = new ColorPicker(),
            position1 = 0,
            position2 = 0.2,
            position3 = 0.4,
            position4 = 0.8,
            position5 = 1,
            loopTimes = new Range(1, 3),
            direction = 'down',
            layerOpacity = 1.0,
        },
    ) {
        super();
        this.color1 = color1;
        this.color2 = color2;
        this.color3 = color3;
        this.color4 = color4;
        this.color5 = color5;
        this.position1 = position1;
        this.position2 = position2;
        this.position3 = position3;
        this.position4 = position4;
        this.position5 = position5;
        this.loopTimes = loopTimes;
        this.direction = direction;
        this.layerOpacity = layerOpacity;
    }
}
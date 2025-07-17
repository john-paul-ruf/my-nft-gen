import { EffectConfig } from '../../../core/layer/EffectConfig.js';

/** *
 *
 * Config for Amp Effect
 * Creates a wheel of 'rays' based on the sparsity factor that spins based on the speed
 *
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @underLayerOpacity - the opacity of the bottom, fuzzy, layer
 * @sparsityFactor - Array: Randomly picks from the array to draw a 'ray' every X angle
 * @stroke - the weight of the outer ray
 * @thickness - the weight of the inner ray
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 * @speed - Range: spin this amount of angle
 * @length - Length of the line to draw
 * @lineStart - From the center, where to start the line
 * @center - Where the center of the amp is in the overall composition
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 *
 */

export class AmpConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            invertDirection = false,
            layerOpacity = 0.55,
            underLayerOpacity = 0.5,
            sparsityFactor = [1, 2, 3],
            stroke = 1,
            thickness = 1,
            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            featherTimes = { lower: 2, upper: 4 },
            speed = { lower: 24, upper: 36 },
            length = 200,
            lineStart = 350,
            center = { x: 1080 / 2, y: 1920 / 2 },
            innerColor = null,
            outerColor = null,
        },
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
        this.invertDirection = invertDirection;
    }
}

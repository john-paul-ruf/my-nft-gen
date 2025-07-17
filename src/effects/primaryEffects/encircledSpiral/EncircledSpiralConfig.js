import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import { Point2D } from '../../../core/layer/configType/Point2D.js';
import { ColorPicker } from '../../../core/layer/configType/ColorPicker.js';

/** *
 *
 * Config for Encircled Spiral Effect
 * Creates N spirals based on the sequence and number of rings
 *
 * @invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 * @layerOpacity - the opacity of the top, non-fuzzy, layer
 * @underLayerOpacity - the opacity of the bottom, fuzzy, layer
 * @numberOfRings - Range: Number of rings to generate
 * @stroke - the weight of the outer ring
 * @thickness - the weight of the inner ring
 * @sparsityFactor - Array: spokes generated on angle
 * @sequencePixelConstant - PercentageRange: the pixel translation of the individual sequence.  1 sequence equals sequencePixelConstant
 * @sequence - Array: the sequence to follow when generating the spiral
 * @minSequenceIndex - Array: where to start drawing the sequence
 * @numberOfSequenceElements: Array: how many sequence elements to draw past the minSequenceIndex
 * @speed: Range: the number of times to rotate between sparsity factors
 * @accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 * @blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 * @featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 * @center - Point2D: Where the center is in the overall composition
 * @innerColor - ColorPicker: the color for the thickness
 * @outerColor - ColorPicker: the color for the stroke and accent
 *
 */

export class EncircledSpiralConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 0.55,
            underLayerOpacity = 0.5,
            numberOfRings = { lower: 20, upper: 20 },
            stroke = 1,
            thickness = 2,
            sparsityFactor = [60],
            sequencePixelConstant = {
                lower: (finalSize) => finalSize.shortestSide * 0.001,
                upper: (finalSize) => finalSize.shortestSide * 0.001,
            },
            sequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
            minSequenceIndex = [12],
            numberOfSequenceElements = [3],
            speed = { lower: 2, upper: 2 },
            accentRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
            blurRange = { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
            featherTimes = { lower: 2, upper: 4 },
            center = new Point2D(1080 / 2, 1920 / 2),
            innerColor = new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.numberOfRings = numberOfRings;
        this.stroke = stroke;
        this.thickness = thickness;
        this.sparsityFactor = sparsityFactor;
        this.sequencePixelConstant = sequencePixelConstant;
        this.sequence = sequence;
        this.minSequenceIndex = minSequenceIndex;
        this.numberOfSequenceElements = numberOfSequenceElements;
        this.speed = speed;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.center = center;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
    }
}

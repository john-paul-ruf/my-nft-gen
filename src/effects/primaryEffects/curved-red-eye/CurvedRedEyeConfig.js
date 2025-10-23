import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Point2D} from 'my-nft-gen/src/core/layer/configType/Point2D.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';

export class CurvedRedEyeConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 0.55,
            underLayerOpacity = 0.75,
            innerColor = new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke = 2,
            thickness = 1,
            center = new Point2D(1080 / 2, 1920 / 2),
            numberOfSpokes=  {lower: 20, upper: 100},
            sparsityFactor = [12],
            arcSteps = {lower: 20, upper: 50},
            innerRadius = 75,
            outerRadius = 450,
            possibleJumpRangeInPixels = {lower: 10, upper: 30},
            lineLength = {lower: 50, upper: 75},
            numberOfLoops = {lower: 1, upper: 1},
            accentRange = {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange = {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes = {lower: 2, upper: 4},
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
        this.stroke = stroke;
        this.thickness = thickness;
        this.lineLength = lineLength;
        this.numberOfLoops = numberOfLoops;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.center = center;
        this.numberOfSpokes = numberOfSpokes;
        this.sparsityFactor = sparsityFactor;
        this.arcSteps = arcSteps;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.possibleJumpRangeInPixels = possibleJumpRangeInPixels;
    }
}

import {EffectConfig} from "../../../core/layer/EffectConfig.js";
import {Point2D} from "../../../core/layer/configType/Point2D.js";
import {ColorPicker} from "../../../core/layer/configType/ColorPicker.js";

export class RedEyeConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 0.55,
            underLayerOpacity = 0.75,
            center = new Point2D(1080 / 2, 1920/2),
            innerColor = new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke = 2,
            thickness = 1,
            sparsityFactor = [12],
            innerRadius = 75,
            outerRadius = 450,
            numberOfSegments = 20,
            possibleJumpRange= {lower: 1, upper: 3},
            possibleSideBuffer= {lower: 2, upper: 10},
            lineLength= {lower: 50, upper: 75},
            numberOfLoops = {lower: 1, upper: 1},
            accentRange = {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange = {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes = {lower: 2, upper: 4},
        }
    ) {
        super();
            this.invertLayers = invertLayers;
            this.layerOpacity = layerOpacity;
            this.underLayerOpacity = underLayerOpacity;
            this.center = center;
            this.innerColor = innerColor;
            this.outerColor = outerColor;
            this.stroke = stroke;
            this.thickness = thickness;
            this.sparsityFactor = sparsityFactor;
            this.innerRadius = innerRadius;
            this.outerRadius = outerRadius;
            this.numberOfSegments = numberOfSegments;
            this.possibleJumpRange= possibleJumpRange;
            this.possibleSideBuffer= possibleSideBuffer;
            this.lineLength = lineLength;
            this.numberOfLoops = numberOfLoops;
            this.accentRange =accentRange;
            this.blurRange = blurRange;
            this.featherTimes = featherTimes;
    }
}
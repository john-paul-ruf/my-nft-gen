import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {Point2D} from 'my-nft-gen/src/core/layer/configType/Point2D.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';

export class StaticPathConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            layerOpacity = 0.55,
            underLayerOpacity = 0.75,
            innerColor = new ColorPicker(ColorPicker.SelectionType.neutralBucket),
            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            stroke = 2,
            thickness = 1,
            lineLength = {lower: 50, upper: 75},
            numberOfLoops = {lower: 1, upper: 1},
            accentRange = {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
            blurRange = {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            featherTimes = {lower: 2, upper: 4},
            path= [{x: 0, y: 0}, {x: 0, y: 200}],
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
        this.path = path;
    }
}

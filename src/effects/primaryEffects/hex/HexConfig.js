import { EffectConfig } from 'my-nft-gen';
import {ColorPicker} from "my-nft-gen/src/core/layer/configType/ColorPicker.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

export class HexConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.8,
            sparsityFactor = [12, 15, 18/* 20, 24, 30, 36 */],
            outerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            innerColor = new ColorPicker(ColorPicker.SelectionType.colorBucket),
            gapFactor = new Range(3, 6),
            radiusFactor = new Range(1, 3),
            accentRange = new DynamicRange(new Range(0, 0), new Range(0.75, 1.5)),
            blurRange = new DynamicRange(new Range(0, 1), new Range(2, 3)),
            featherTimes = new Range(2, 4),
            stroke = 1,
            thickness = 0.5,
            scaleFactor = 0.5,
            numberOfHex = 12,
            strategy = ['static', 'angle', 'rotate'],
            overlayStrategy = ['flat', 'overlay'],
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
        },
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.sparsityFactor = sparsityFactor;
        this.innerColor = innerColor;
        this.outerColor = outerColor;
        this.gapFactor = gapFactor;
        this.radiusFactor = radiusFactor;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.stroke = stroke;
        this.thickness = thickness;
        this.scaleFactor = scaleFactor;
        this.numberOfHex = numberOfHex;
        this.strategy = strategy;
        this.overlayStrategy = overlayStrategy;
        this.center = center;
    }
}

import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";
import {PercentageRange} from "my-nft-gen/src/core/layer/configType/PercentageRange.js";
import {PercentageLongestSide} from "my-nft-gen/src/core/layer/configType/PercentageLongestSide.js";
import {PercentageShortestSide} from "my-nft-gen/src/core/layer/configType/PercentageShortestSide.js";

export class NthRingsConfig extends EffectConfig {
    constructor(
        {
            invertLayers = true,
            totalRingCount = new Range(12, 16),
            layerOpacity = 0.5,
            underLayerOpacity = 0.4,
            stroke = 2,
            thickness = 2,
            smallRadius = new PercentageRange(new PercentageLongestSide(0.10), new PercentageLongestSide(0.10)),
            smallNumberOfRings = new Range(8, 12),
            ripple = new PercentageRange(new PercentageShortestSide(0.05), new PercentageShortestSide(0.10)),
            times = new Range(2, 4),
            smallerRingsGroupRadius = new PercentageRange(new PercentageShortestSide(0.45), new PercentageShortestSide(0.55)),
            accentRange = new DynamicRange(new Range(1, 1), new Range(3, 5)),
            blurRange = new DynamicRange(new Range(1, 1), new Range(2, 4)),
            featherTimes = new Range(2, 4),
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
        },
    ) {
        super();
        this.invertLayers = invertLayers;
        this.totalRingCount = totalRingCount;
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.stroke = stroke;
        this.thickness = thickness;
        this.smallRadius = smallRadius;
        this.smallNumberOfRings = smallNumberOfRings;
        this.ripple = ripple;
        this.times = times;
        this.smallerRingsGroupRadius = smallerRingsGroupRadius;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
        this.center = center;
    }
}

import { EffectConfig } from 'my-nft-gen';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {DynamicRange} from "my-nft-gen/src/core/layer/configType/DynamicRange.js";

export class ScanLinesConfig extends EffectConfig {
    constructor(
        {
            lines = new Range(2, 4),
            minlength = new Range(30, 40),
            maxlength = new Range(80, 100),
            times = new Range(4, 8),
            alphaRange = new DynamicRange(new Range(0.3, 0.4), new Range(0.5, 0.6)),
            alphaTimes = new Range(4, 8),
            loopTimes = new Range(1, 2),
        },
    ) {
        super();
        this.lines = lines;
        this.minlength = minlength;
        this.maxlength = maxlength;
        this.times = times;
        this.alphaRange = alphaRange;
        this.alphaTimes = alphaTimes;
        this.loopTimes = loopTimes;
    }
}

import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {MultiStepDefinitionConfig} from "my-nft-gen/src/core/math/MultiStepDefinitionConfig.js";
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";
import {Position} from "my-nft-gen/src/core/position/Position.js";

export class MappedFramesConfig extends EffectConfig {
    constructor(
        {
            folderName = '/mappedFrames/',
            layerOpacity = [0.95],
            buffer = [555],
            loopTimesMultiStep = [
                new MultiStepDefinitionConfig({
                    minPercentage: 0,
                    maxPercentage: 100,
                    max: new Range(0, 0),
                    times: new Range(5, 5),
                    invert: false
                }),
            ],
            center = new Position({x: 0, y: 0}),
        },
    ) {
        super();
        this.folderName = folderName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
        this.loopTimesMultiStep = loopTimesMultiStep;
        this.center = center;
    }
}

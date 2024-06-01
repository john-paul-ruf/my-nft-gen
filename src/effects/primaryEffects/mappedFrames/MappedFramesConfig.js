import { EffectConfig } from '../../../core/layer/EffectConfig.js';
import {MultiStepDefinitionConfig} from "../../../core/math/MultiStepDefinitionConfig.js";
import {Range} from "../../../core/layer/configType/Range.js";

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
        },
    ) {
        super();
        this.folderName = folderName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
        this.loopTimesMultiStep = loopTimesMultiStep;
    }
}

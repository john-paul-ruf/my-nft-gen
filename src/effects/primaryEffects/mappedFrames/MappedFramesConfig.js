import {EffectConfig} from "../../../core/layer/EffectConfig.js";
import {loop} from "three/nodes";

export class MappedFramesConfig extends EffectConfig {
    constructor(
        {
            folderName= '/mappedFrames/',
            layerOpacity= [0.95],
            buffer= [555],
            loopTimes = 1,
        }
    ) {
        super();
        this.folderName = folderName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
        this.loopTimes = loopTimes;
    }
}
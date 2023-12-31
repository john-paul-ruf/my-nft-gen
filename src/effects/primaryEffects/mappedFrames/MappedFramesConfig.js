import {EffectConfig} from "../../EffectConfig.js";

export class MappedFramesConfig extends EffectConfig {
    constructor(
        {
            folderName= '/mappedFrames/',
            layerOpacity= [0.95],
            buffer= [555]
        }
    ) {
        super();
        this.folderName = folderName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
    }
}
import {EffectConfig} from "../../../core/layer/EffectConfig.js";
import {Point2D} from "../../../core/layer/configType/Point2D.js";

export class StaticImageKeyFrameConfig extends EffectConfig {
    constructor(
        {
            fileName = '/imageOverlay/',
            center = new Point2D(0,0),
            layerOpacity = [0.95],
            buffer = [555],
            keyFrames = [0, 120, 360, 900],
            glitchFrameCount = [15, 30],
        }
    ) {
        super();
        this.fileName = fileName;
        this.layerOpacity = layerOpacity;
        this.buffer = buffer;
        this.keyFrames = keyFrames;
        this.glitchFrameCount = glitchFrameCount;
        this.center = center;
    }
}

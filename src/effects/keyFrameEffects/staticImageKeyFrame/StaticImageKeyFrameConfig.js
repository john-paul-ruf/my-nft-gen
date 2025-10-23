import {EffectConfig} from "my-nft-gen";
import {Position} from "my-nft-gen/src/core/position/Position.js";

export class StaticImageKeyFrameConfig extends EffectConfig {
    constructor(
        {
            fileName = '/imageOverlay/',
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
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

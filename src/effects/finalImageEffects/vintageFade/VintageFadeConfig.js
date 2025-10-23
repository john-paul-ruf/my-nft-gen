import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {getAllFindValueAlgorithms} from 'my-nft-gen/src/core/math/findValue.js';
import {Range} from "my-nft-gen/src/core/layer/configType/Range.js";

/**
 * Config for VintageFadeEffect
 * Controls warmth, grain intensity and flicker speed
 *
 * @warmth - Range: warmth level range
 * @grainIntensity - Range: grain intensity range
 * @flickerSpeed - Range: flicker speed range
 * @flickerFindValueAlgorithm - algorithm for flicker animation
 */
export class VintageFadeConfig extends EffectConfig {
    constructor({
        warmth = new Range(0.15, 0.35),
        grainIntensity = new Range(0.05, 0.15),
        flickerSpeed = new Range(2, 6),
        flickerFindValueAlgorithm = getAllFindValueAlgorithms(),
    } = {}) {
        super();
        this.warmth = warmth;
        this.grainIntensity = grainIntensity;
        this.flickerSpeed = flickerSpeed;
        this.flickerFindValueAlgorithm = flickerFindValueAlgorithm;
    }
}

import {EffectConfig} from '../../../core/layer/EffectConfig.js';
import {getAllFindValueAlgorithms} from '../../../core/math/findValue.js';

/**
 * Config for VintageFadeEffect
 * Controls warmth, grain intensity and flicker speed
 */
export class VintageFadeConfig extends EffectConfig {
    constructor({
        warmth = {lower: 0.15, upper: 0.35},
        grainIntensity = {lower: 0.05, upper: 0.15},
        flickerSpeed = {lower: 2, upper: 6},
        flickerFindValueAlgorithm = getAllFindValueAlgorithms(),
    } = {}) {
        super();
        this.warmth = warmth;
        this.grainIntensity = grainIntensity;
        this.flickerSpeed = flickerSpeed;
        this.flickerFindValueAlgorithm = flickerFindValueAlgorithm;
    }
}

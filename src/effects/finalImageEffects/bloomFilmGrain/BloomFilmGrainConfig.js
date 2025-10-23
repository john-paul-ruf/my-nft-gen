import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {getAllFindValueAlgorithms} from "my-nft-gen/src/core/math/findValue.js";

/** *
 *
 * Config for Blur Effect
 * Creates an animated blur for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 *
 * @lowerRange - a lower and upper value for where the amount of blur starts
 * @upperRange - a lower and upper value for where the amount of blur ends
 * @times - the number of times to blur from lower to upper during the total frame count
 * @glitchChance - the percent chance this effect could apply to a given frame
 */
export class BloomFilmGrainConfig extends EffectConfig {
    constructor(
        {
            brightnessRange = {bottom: {lower: 1.5, upper: 1.5}, top: {lower: 2, upper: 2}},
            brightnessTimes = {lower: 2, upper: 8},
            blurRange = {bottom: {lower: 12, upper: 12}, top: {lower: 15, upper: 15}},
            blurTimes = {lower: 2, upper: 8},
            grainRange = {bottom: {lower: 0.2, upper: 0.4}, top: {lower: 0.5, upper: 0.8}},
            grainTimes = {lower: 2, upper: 8},
            grainIntensityRange = {bottom: {lower: 0.08, upper: 0.08}, top: {lower: 0.1, upper: 0.1}},
            grainIntensityTimes = {lower: 2, upper: 8},
            brightnessFindValueAlgorithm = getAllFindValueAlgorithms(),
            blurFindValueAlgorithm = getAllFindValueAlgorithms(),
            grainFindValueAlgorithm = getAllFindValueAlgorithms(),
            grainIntensityFindValueAlgorithm = getAllFindValueAlgorithms(),
        },
    ) {
        super();
        this.brightnessRange = brightnessRange;
        this.brightnessTimes = brightnessTimes;
        this.blurRange = blurRange;
        this.blurTimes = blurTimes;
        this.grainRange = grainRange;
        this.grainTimes = grainTimes;
        this.grainIntensityRange = grainIntensityRange;
        this.grainIntensityTimes = grainIntensityTimes;
        this.brightnessFindValueAlgorithm = brightnessFindValueAlgorithm;
        this.blurFindValueAlgorithm = blurFindValueAlgorithm;
        this.grainFindValueAlgorithm = grainFindValueAlgorithm;
        this.grainIntensityFindValueAlgorithm = grainIntensityFindValueAlgorithm;
    }
}

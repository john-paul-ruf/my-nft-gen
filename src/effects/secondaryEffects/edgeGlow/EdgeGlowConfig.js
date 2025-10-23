import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';
import {getAllFindValueAlgorithms} from "my-nft-gen/src/core/math/findValue.js";

export class EdgeGlowConfig extends EffectConfig {
    constructor(
        {
            glowBottom = [255, 0, 255],     // magenta
            glowTop = [0, 255, 255],        // cyan
            glowTimes = {lower: 2, upper: 6},
            brightnessRange = {bottom: {lower: 1.5, upper: 1.5}, top: {lower: 2, upper: 2}},
            brightnessTimes = {lower: 2, upper: 8},
            blurRange = {bottom: {lower: 12, upper: 12}, top: {lower: 15, upper: 15}},
            blurTimes = {lower: 2, upper: 8},
            brightnessFindValueAlgorithm = getAllFindValueAlgorithms(),
            blurFindValueAlgorithm = getAllFindValueAlgorithms(),
        },
    ) {
        super();
        this.glowBottom = glowBottom;
        this.glowTop = glowTop;
        this.glowTimes = glowTimes;
        this.brightnessRange = brightnessRange;
        this.brightnessTimes = brightnessTimes;
        this.blurRange = blurRange;
        this.blurTimes = blurTimes;
        this.brightnessFindValueAlgorithm = brightnessFindValueAlgorithm;
        this.blurFindValueAlgorithm = blurFindValueAlgorithm;
    }
}

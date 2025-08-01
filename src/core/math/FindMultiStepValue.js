import { findValue, FindValueAlgorithm } from "./findValue.js";
import { MultiStepDefinition } from "./MultiStepDefinition.js";
import { getRandomIntInclusive } from "./random.js";

export class FindMultiStepStepValue {
    static convertFromConfigToDefinition(multistepConfig) {
        return multistepConfig.map(config => new MultiStepDefinition({
            invert: getRandomIntInclusive(0, 1) === 1,
            minPercentage: config.minPercentage,
            maxPercentage: config.maxPercentage,
            max: getRandomIntInclusive(config.max.lower, config.max.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            type: config.type,
        }));
    }

    static findValue({
                         stepArray = [new MultiStepDefinition({})],
                         currentFrame = 0,
                         totalNumberOfFrames = 100
                     }) {
        const info = FindMultiStepStepValue.getFindValueInfo({ stepArray, currentFrame, totalNumberOfFrames });

        if (info.totalNumberOfFrames === 0) return 0;

        let val = findValue(
            info.min,
            info.max,
            info.times,
            info.totalNumberOfFrames,
            info.currentFrame,
            info.type
        );

        if (info.invert) {
            val = info.max - (val - info.min);
        }

        return val;
    }

    static getFindValueInfo({
                                stepArray = [new MultiStepDefinition({})],
                                currentFrame = 0,
                                totalNumberOfFrames = 100
                            }) {
        let previousStepFrame = 0;

        for (let index = 0; index < stepArray.length; index++) {
            const step = stepArray[index];
            const stepRangePercent = (step.maxPercentage - step.minPercentage) * 0.01;
            const stepFrames = Math.round(totalNumberOfFrames * stepRangePercent);
            const currentStepPercent = (currentFrame / totalNumberOfFrames) * 100;
            const isLastStep = index === stepArray.length - 1;

            if (
                currentStepPercent >= step.minPercentage &&
                (currentStepPercent < step.maxPercentage || isLastStep)
            ) {
                const stepCurrentFrame = currentFrame - previousStepFrame;

                return {
                    min: 0,
                    max: step.max,
                    times: step.times,
                    totalNumberOfFrames: stepFrames,
                    currentFrame: stepCurrentFrame,
                    type: step.type,
                    invert: step.invert,
                };
            }

            previousStepFrame += stepFrames;
        }

        console.warn("No step matched for frame:", currentFrame);
        return {
            min: 0,
            max: 0,
            times: 0,
            totalNumberOfFrames: 0,
            currentFrame: 0,
            type: FindValueAlgorithm.COSINE_BELL,
            invert: false,
        };
    }
}

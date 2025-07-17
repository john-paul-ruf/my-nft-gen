import {findValue} from "./findValue.js";
import {MultiStepDefinition} from "./MultiStepDefinition.js";
import {mapNumberToRange} from "./mapNumberToRange.js";
import {getRandomIntInclusive} from "./random.js";

export class FindMultiStepStepValue {

    static convertFromConfigToDefinition(multistepConfig) {
        const multiStep = [];

        for (let index = 0; index < multistepConfig.length; index++) {
            multiStep.push(new MultiStepDefinition({
                invert: getRandomIntInclusive(0,1) === 1,
                minPercentage: multistepConfig[index].minPercentage,
                maxPercentage: multistepConfig[index].maxPercentage,
                max: getRandomIntInclusive(multistepConfig[index].max.lower, multistepConfig[index].max.upper,),
                times: getRandomIntInclusive(multistepConfig[index].times.lower, multistepConfig[index].times.upper),
            }));
        }

        return multiStep;
    }

    static findValue({
                         stepArray = [
                             new MultiStepDefinition({}),
                         ],
                         currentFrame = 0,
                         totalNumberOfFrames = 100
                     }) {


        const info = FindMultiStepStepValue.getFindValueInfo({stepArray, currentFrame, totalNumberOfFrames})

        return findValue(
            info.min,
            info.max,
            info.times,
            info.totalNumberOfFrames,
            info.currentFrame,
        );
    }

    static getFindValueInfo({
                                stepArray = [
                                    new MultiStepDefinition({}),
                                ],
                                currentFrame = 0,
                                totalNumberOfFrames = 100
                            }) {

        let previousStepFrame = 0;

        for (let index = 0; index < stepArray.length; index++) {
            const currentStepPercentage = ((currentFrame / totalNumberOfFrames) * 100);
            const stepFrames = (totalNumberOfFrames * ((stepArray[index].maxPercentage - stepArray[index].minPercentage) * 0.01));
            const stepCurrentFrame = currentFrame - previousStepFrame;

            //if the multi step is one range, just return find value
            if (stepArray[index].minPercentage === 0
                && stepArray[index].maxPercentage === 100) {
                return {
                    min: 0,
                    max: stepArray[index].max,
                    times: stepArray[index].times,
                    totalNumberOfFrames: totalNumberOfFrames,
                    currentFrame: currentFrame,
                }

            }

            //find the range this falls into
            if (
                currentStepPercentage >= stepArray[index].minPercentage
                && currentStepPercentage < stepArray[index].maxPercentage
            ) {
                //call find value with correct values for total frame and current frame
                return {
                    min: 0,
                    max: stepArray[index].max,
                    times: stepArray[index].times,
                    totalNumberOfFrames: stepFrames,
                    currentFrame: stepCurrentFrame,
                }
            }

            previousStepFrame += stepFrames;
        }

        return {
            min: 0,
            max: 0,
            times: 0,
            totalNumberOfFrames: 0,
            currentFrame: 0,
        }

    }
}
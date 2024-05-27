import {findValue} from "./findValue.js";
import {MultiStepDefinition} from "./MultiStepDefinition.js";
import {mapNumberToRange} from "./mapNumberToRange.js";

export class FindMultiStepStepValue {
    static findValue({
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

            if (
                currentStepPercentage >= stepArray[index].minPercentage
                && currentStepPercentage <= stepArray[index].maxPercentage
            ) {
                return findValue(
                    stepArray[index].min,
                    stepArray[index].max,
                    stepArray[index].times,
                    stepFrames,
                    stepCurrentFrame,
                    stepArray[index].invert);
            }

            previousStepFrame += stepFrames;
        }
    }
}
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

        let previousFrameBlocks = 0;

        for (let index = 0; index < stepArray.length; index++) {
            const currentStepPercentage = (currentFrame / totalNumberOfFrames) * 100;
            const previousPercentage = index > 0 ? stepArray[index - 1].percentage : 0;
            const nextPercentage = index < stepArray.length - 1 ? stepArray[index + 1].percentage : 100;

            if (
                currentStepPercentage >= previousPercentage
                && currentStepPercentage <= nextPercentage
            ) {

                return findValue(
                    stepArray[index].min,
                    stepArray[index].max,
                    stepArray[index].times,
                    (totalNumberOfFrames * (stepArray[index].percentage * 0.01)),
                    currentFrame - previousFrameBlocks,
                    stepArray[index].invert);
            }

            previousFrameBlocks += (totalNumberOfFrames * (stepArray[index].percentage * 0.01));
        }
    }
}
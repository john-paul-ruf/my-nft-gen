import {findValue} from "./findValue.js";

export class FindMultiStepStepValue {
    static findValue({
                         stepArray = [
                             new FindMultiStepStepValue()
                         ],
                         currentFrame = 0,
                         totalNumberOfFrames = 100
                     }) {

        for (let index = 0; index < stepArray.length; index++) {
            const overallPercentage = currentFrame / totalNumberOfFrames;
            const previousPercentage = index > 0 ? stepArray[index - 1].percentage : 0;
            const currentStepPercentage = stepArray[index].percentage;
            const nextPercentage = index < stepArray.length - 1 ? stepArray[index + 1].percentage : 100;

            if (
                currentStepPercentage > previousPercentage
                && currentStepPercentage <= nextPercentage
            ) {
                return findValue(stepArray[index].min, stepArray[index].max, stepArray[index].times, totalNumberOfFrames, currentFrame, stepArray[index].invert);
            }
        }
    }
}
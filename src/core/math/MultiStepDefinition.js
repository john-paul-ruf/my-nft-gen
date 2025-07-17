export class MultiStepDefinition {

    constructor({
                    minPercentage = 0,
                    maxPercentage = 100,
                    max = 25,
                    times = 1,
                }) {
        this.minPercentage = minPercentage;
        this.maxPercentage = maxPercentage;
        this.max = max;
        this.times = times;
    }
}
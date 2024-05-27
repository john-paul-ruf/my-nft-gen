export class MultiStepDefinition {

    constructor({
                    minPercentage = 0,
                    maxPercentage = 100,
                    min = 0,
                    max = 25,
                    times = 1,
                    invert = false,
                }) {
        this.minPercentage = minPercentage;
        this.maxPercentage = maxPercentage;
        this.min = min;
        this.max = max;
        this.times = times;
        this.invert = invert;
    }
}
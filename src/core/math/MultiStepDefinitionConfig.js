export class MultiStepDefinitionConfig {

    constructor({
                    minPercentage = 0,
                    maxPercentage = 100,
                    max = new Range(20,30),
                    times  = new Range(1,3),
                }) {
        this.minPercentage = minPercentage;
        this.maxPercentage = maxPercentage;
        this.max = max;
        this.times = times;
    }
}
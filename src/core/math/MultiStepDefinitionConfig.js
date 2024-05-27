export class MultiStepDefinitionConfig {

    constructor({
                    percentage = 100,
                    min = new Range(0,10),
                    max = new Range(20,30),
                    times  = new Range(1,3),
                    invert = false,
                }) {
        this.percentage = percentage;
        this.min = min;
        this.max = max;
        this.times = times;
        this.invert = invert;
    }
}
export class MultiStepDefinition {

    constructor({
                    percentage = 100,
                    min = 0,
                    max = 25,
                    times = 1,
                    invert = false,
                }) {
        this.percentage = percentage;
        this.min = min;
        this.max = max;
        this.times = times;
        this.invert = invert;
    }
}
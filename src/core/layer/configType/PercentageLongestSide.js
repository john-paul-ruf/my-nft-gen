export class PercentageLongestSide {
    constructor(percent = 0) {
        this.percent = percent;
        this.percentFunction = (finalSize) => finalSize.shortestSide * this.percent;
    }
}

export class PercentageShortestSide {
    constructor(percent = 0) {
        this.percent = percent;
        this.percentFunction = (finalSize) => finalSize.longestSide * this.percent;
    }
}

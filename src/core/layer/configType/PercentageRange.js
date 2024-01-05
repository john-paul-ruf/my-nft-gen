export class PercentageRange {
    constructor(lower = new PercentageShortestSide(0), upper = new PercentageLongestSide(0)) {
        this.lower = lower.percentFunction;
        this.upper = upper.percentFunction;
    }
}
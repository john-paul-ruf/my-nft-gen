export class PercentageShortestSide {
    static _name_ = 'PercentageShortestSide';

    constructor(percent = 0) {
        this.percent = percent;
        this.percentFunction = (finalSize) => finalSize.shortestSide * this.percent;
    }
}

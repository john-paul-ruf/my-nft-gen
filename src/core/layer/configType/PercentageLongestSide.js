export class PercentageLongestSide {
    static _name_ = 'PercentageLongestSide';

    constructor(percent = 0) {
        this.percent = percent;
        this.percentFunction = (finalSize) => finalSize.longestSide * this.percent;
    }
}

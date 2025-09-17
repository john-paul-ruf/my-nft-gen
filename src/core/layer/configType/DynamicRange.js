import { Range } from './Range.js';

export class DynamicRange {
    static _name_ = 'DynamicRange';

    constructor(bottom = new Range(0, 0), top = new Range(0, 0)) {
        this.bottom = bottom;
        this.top = top;
    }
}

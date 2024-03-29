import { getRandomIntExclusive } from '../math/random.js';

export class ColorScheme {
    constructor({
        colorBucket = [],
        colorSchemeInfo = 'Please define a color scheme',
    }) {
        this.colorBucket = colorBucket;
        this.colorSchemeInfo = colorSchemeInfo;
    }

    getColorFromBucket() {
        return this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
    }

    getColorSchemeInfo() {
        return this.colorSchemeInfo;
    }
}

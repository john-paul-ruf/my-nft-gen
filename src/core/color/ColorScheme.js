import {getRandomIntExclusive} from "../math/random.js";

export class ColorScheme {
    constructor({
                    colorBucket = [],
                    colorStrategy = 'default',
                    getColorSchemeInfo = getColorSchemeInfo

                }) {

        this.colorBucket = colorBucket;
        this.colorStrategy = colorStrategy;
        this.getColorSchemeInfo = getColorSchemeInfo;

    }

    getColorFromBucket() {
        return this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
    }

    getColorSchemeInfo() {
        return this.getColorSchemeInfo();
    }
}
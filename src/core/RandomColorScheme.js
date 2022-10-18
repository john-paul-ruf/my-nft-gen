import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "./math/random.js";
import palette from "google-palette";
import ColorScheme from "color-scheme";
import fs from "fs";

//Loading json for if we pick the nice-colors-palettes strategy
let niceColors = JSON.parse(fs.readFileSync('src/data/nice-colors-1000.json').toString())

export class RandomColorScheme {
    constructor() {
        this.colorSchemeStrategy = 'color-scheme';
        this.niceColorPalettesStrategy = 'nice-color-palettes';
        this.googlePaletteStrategy = 'google-palette';

        switch (getRandomIntInclusive(0, 2)) {
            case 0:
                this.colorStrategy = this.colorSchemeStrategy;
                break;
            case 1:
                this.colorStrategy = this.niceColorPalettesStrategy;
                break;
            case 2:
                this.colorStrategy = this.googlePaletteStrategy;
                break;
        }


        switch (this.colorStrategy) {
            case this.colorSchemeStrategy:

                //'mono', 'contrast', 'triade', 'tetrade', 'analogic'.
                const schemeBucket = ['contrast'];

                //'default', 'pastel', 'soft', 'light', 'hard', 'pale'
                const variationBucket = ['hard'];

                const getColorBucket = () => {
                    const bucket = new ColorScheme();
                    return bucket.from_hue(this.hue)
                        .scheme(this.scheme)
                        .distance(this.distance)
                        .variation(this.variations)
                        .colors();
                }

                this.scheme = schemeBucket[getRandomIntExclusive(0, schemeBucket.length)];
                this.variations = variationBucket[getRandomIntExclusive(0, variationBucket.length)];
                this.hue = getRandomIntExclusive(0, 360);
                this.distance = randomNumber(0, 0.8);
                this.colorBucket = getColorBucket()

                break;
            case this.niceColorPalettesStrategy:
                this.colorBucket = niceColors[getRandomIntExclusive(0, niceColors.length)];
                break;
            case this.googlePaletteStrategy:
                switch (getRandomIntInclusive(0, 15)) {
                    case 0:
                        this.googlePaletteSelector = 'mpn65';
                        break;
                    case 1:
                        this.googlePaletteSelector = 'tol';
                        break;
                    case 2:
                        this.googlePaletteSelector = 'tol-sq';
                        break;
                    case 3:
                        this.googlePaletteSelector = 'tol-dv';
                        break;
                    case 4:
                        this.googlePaletteSelector = 'tol-rainbow';
                        break;
                    case 5:
                        this.googlePaletteSelector = 'cb-BrBG';
                        break;
                    case 6:
                        this.googlePaletteSelector = 'cb-PRGn';
                        break;
                    case 7:
                        this.googlePaletteSelector = 'cb-PiYG';
                        break;
                    case 8:
                        this.googlePaletteSelector = 'cb-PuOr';
                        break;
                    case 9:
                        this.googlePaletteSelector = 'cb-RdBu';
                        break;
                    case 10:
                        this.googlePaletteSelector = 'cb-RdGy';
                        break;
                    case 11:
                        this.googlePaletteSelector = 'cb-RdYlBu';
                        break;
                    case 12:
                        this.googlePaletteSelector = 'cb-RdYlGn';
                        break;
                    case 13:
                        this.googlePaletteSelector = 'cb-Spectral';
                        break;
                    case 14:
                        this.googlePaletteSelector = 'cb-Paired';
                        break;
                    case 15:
                        this.googlePaletteSelector = 'cb-Set3';
                        break;
                    default:
                        throw 'no google palette selected';
                }


                this.colorBucket = palette(this.googlePaletteSelector, 10);

                break;
            default:
                throw 'no color scheme strategy';
        }
    }

    getColorFromBucket() {
        switch (this.colorStrategy) {
            case this.colorSchemeStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case this.niceColorPalettesStrategy:
                return this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case this.googlePaletteStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            default:
                throw 'no color scheme strategy';
        }
    }

    getColorBucket() {
        return this.colorBucket;
    }

    getColorSchemeStrategy() {
        return this.colorSchemeStrategy;
    }

    getNiceColorPalettesStrategy() {
        return this.niceColorPalettesStrategy;
    }

    getGooglePaletteStrategy() {
        return this.googlePaletteStrategy;
    }

    getGooglePaletteSelector() {
        return this.googlePaletteSelector;
    }

    getColorStrategy() {
        return this.colorStrategy;
    }

    getSchemeInfo() {

        if (this.colorStrategy === this.colorSchemeStrategy) {
            return {
                scheme: this.scheme, variations: this.variations, hue: this.hue, distance: this.distance
            }
        }

        throw 'color-scheme strategy not selected'
    }

}
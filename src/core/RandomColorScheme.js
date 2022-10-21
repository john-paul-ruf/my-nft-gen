import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "./math/random.js";
import palette from "google-palette";
import ColorScheme from "color-scheme";
import fs from "fs";

//Loading json for if we pick the nice-colors-palettes strategy
let niceColors = JSON.parse(fs.readFileSync('src/data/nice-colors.json').toString())
let colrOrgColors = JSON.parse(fs.readFileSync('src/data/colr-org-1000-10-plus.json').toString())

export class RandomColorScheme {
    constructor() {
        this.colorSchemeStrategy = 'color-scheme';
        this.niceColorPalettesStrategy = 'nice-color-palettes';
        this.googlePaletteStrategy = 'google-palette';
        this.colrOrgStrategy = 'colr.org';

        switch (getRandomIntInclusive(0, 3)) {
            case 0:
                this.colorStrategy = this.colorSchemeStrategy;
                break;
            case 1:
                this.colorStrategy = this.niceColorPalettesStrategy;
                break;
            case 2:
                this.colorStrategy = this.googlePaletteStrategy;
                break;
            case 3:
                this.colorStrategy = this.colrOrgStrategy;
                break;
        }


        switch (this.colorStrategy) {
            case this.colorSchemeStrategy:

                //'mono', 'contrast', 'triade', 'tetrade', 'analogic'.
                const schemeBucket = ['contrast', 'triade', 'tetrade', 'analogic'];

                //'default', 'pastel', 'soft', 'light', 'hard', 'pale'
                const variationBucket = ['hard'];

                this.scheme = schemeBucket[getRandomIntExclusive(0, schemeBucket.length)];
                this.variations = variationBucket[getRandomIntExclusive(0, variationBucket.length)];
                this.hue = getRandomIntExclusive(0, 360);
                this.distance = randomNumber(0, 1);

                const bucket = new ColorScheme();

                this.colorBucket = bucket.from_hue(this.hue)
                    .scheme(this.scheme)
                    .variation(this.variations)
                    .distance(this.distance.toFixed(2))
                    .add_complement(true)
                    .colors();

                break;
            case this.niceColorPalettesStrategy:
                this.colorBucket = niceColors[getRandomIntExclusive(0, niceColors.length)];
                break;
            case this.colrOrgStrategy:
                this.colorBucket = colrOrgColors[getRandomIntExclusive(0, colrOrgColors.length)];
                break;
            case this.googlePaletteStrategy:
                switch (getRandomIntInclusive(0, 4)) {
                    case 0:
                        this.googlePaletteSelector = 'mpn65'; //MY ABSOLUTE FAV RIGHT NOW
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
            case this.colrOrgStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case this.googlePaletteStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            default:
                throw 'no color scheme strategy';
        }
    }

    getColorSchemeInfo() {
        let schemeInfo = null;

        const colorStrategy = this.colorStrategy;

        switch (colorStrategy) {
            case  this.colorSchemeStrategy:
                schemeInfo = {
                    scheme: this.scheme, variations: this.variations, hue: this.hue, distance: this.distance
                };

                return `Strategy: ${this.colorSchemeStrategy}\nHue: ${schemeInfo.hue}\nScheme: ${schemeInfo.scheme}\nVariation: ${schemeInfo.variations}\nDistance: ${schemeInfo.distance.toFixed(2)}\n`
            case  this.niceColorPalettesStrategy:
                return `Strategy: ${this.niceColorPalettesStrategy}\n`
            case  this.colrOrgStrategy:
                return `Strategy: ${this.colrOrgStrategy}\n`
            case  this.googlePaletteStrategy:
                return `Strategy: ${this.googlePaletteStrategy}\nSelector: ${this.googlePaletteSelector}\n`
            default:
                throw 'no color scheme strategy';
        }

    }

}
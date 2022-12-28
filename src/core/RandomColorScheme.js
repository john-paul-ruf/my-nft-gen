import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "./math/random.js";
import palette from "google-palette";
import ColorScheme from "color-scheme";
import fs from "fs";

//Loading json for if we pick the nice-colors-palettes strategy
let niceColors = JSON.parse(fs.readFileSync('src/data/nice-colors.json').toString())
let colrOrgColors = JSON.parse(fs.readFileSync('src/data/colr-org-1000-10-plus.json').toString())

export const possibleColorSchemes = {
    colorSchemeStrategy: 'color-scheme',
    niceColorPalettesStrategy: 'nice-color-palettes',
    googlePaletteStrategy: 'google-palette',
    colrOrgStrategy: 'colr.org',
    neons: 'neons',
}

export class RandomColorScheme {
    constructor(overrideWithScheme = null) {

        if (overrideWithScheme) {
            this.colorStrategy = overrideWithScheme;
        } else {
            switch (getRandomIntInclusive(0, 4)) {
                case 0:
                    this.colorStrategy = possibleColorSchemes.colorSchemeStrategy;
                    break;
                case 1:
                    this.colorStrategy = possibleColorSchemes.niceColorPalettesStrategy;
                    break;
                case 3:
                    this.colorStrategy = possibleColorSchemes.colrOrgStrategy;
                    break;
                case 2:
                    this.colorStrategy = possibleColorSchemes.googlePaletteStrategy;
                    break;
                case 4:
                    this.colorStrategy = possibleColorSchemes.neons;
                    break;

            }
        }


        switch (this.colorStrategy) {
            case possibleColorSchemes.colorSchemeStrategy:

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
            case possibleColorSchemes.niceColorPalettesStrategy:
                this.colorBucket = niceColors[getRandomIntExclusive(0, niceColors.length)];
                break;
            case possibleColorSchemes.colrOrgStrategy:
                this.colorBucket = colrOrgColors[getRandomIntExclusive(0, colrOrgColors.length)];
                break;
            case possibleColorSchemes.neons:
                this.colorBucket = [
                    '#FFFF00',
                    '#FF00FF',
                    '#00FFFF',
                    '#FF0000',
                    '#00FF00',
                    '#0000FF',
                ];
                break;
            case possibleColorSchemes.googlePaletteStrategy:
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
            case possibleColorSchemes.colorSchemeStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case possibleColorSchemes.niceColorPalettesStrategy:
                return this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case possibleColorSchemes.neons:
                return this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case possibleColorSchemes.colrOrgStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            case possibleColorSchemes.googlePaletteStrategy:
                return '#' + this.colorBucket[getRandomIntExclusive(0, this.colorBucket.length)];
            default:
                throw 'no color scheme strategy';
        }
    }

    getColorSchemeInfo() {
        let schemeInfo = null;

        const colorStrategy = this.colorStrategy;

        switch (colorStrategy) {
            case  possibleColorSchemes.colorSchemeStrategy:
                schemeInfo = {
                    scheme: this.scheme, variations: this.variations, hue: this.hue, distance: this.distance
                };

                return `Color Strategy: ${possibleColorSchemes.colorSchemeStrategy}\nHue: ${schemeInfo.hue}\nScheme: ${schemeInfo.scheme}\nVariation: ${schemeInfo.variations}\nDistance: ${schemeInfo.distance.toFixed(2)}\n`
            case  possibleColorSchemes.niceColorPalettesStrategy:
                return `Color Strategy: ${possibleColorSchemes.niceColorPalettesStrategy}\n`
            case  possibleColorSchemes.neons:
                return `Color Strategy: ${possibleColorSchemes.neons}\n`
            case  possibleColorSchemes.colrOrgStrategy:
                return `Color Strategy: ${possibleColorSchemes.colrOrgStrategy}\n`
            case  possibleColorSchemes.googlePaletteStrategy:
                return `Color Strategy: ${possibleColorSchemes.googlePaletteStrategy}\nSelector: ${this.googlePaletteSelector}\n`
            default:
                throw 'no color scheme strategy';
        }

    }

}
//Encapsulated globals are less bad...
import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "./math/random.js";
import ColorScheme from "color-scheme";
import fs from "fs";
import palette from "google-palette"

//Loading json for if we pick the nice-colors-palettes strategy
let niceColors = JSON.parse(fs.readFileSync('src/data/nice-colors-1000.json').toString())

class globalSettings {
    constructor() {
        this.colorSchemeStrategy = 'color-scheme';
        this.niceColorPalettesStrategy = 'nice-color-palettes';
        this.googlePaletteStrategy = 'google-palette';

        this.layerStrategy = 'sharp';
        this.canvasStrategy = 'node-canvas';

        this.workingDirectory = `src/img/working/`;

        this.finalImageHeight = 1920;
        this.finalImageWidth = 1080;

        //For 2D palettes
        this.neutrals = ['#000000',/*
            '#1F1F1F',
            '#5b5b5b',
            '#7f7f7f',*/];

        //for three-dimensional lighting
        this.lights = ['#44ee44', '#ee4444', '#4444ee', '#ee44ee', '#eeee44', '#44eeee',]

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
}

const globals = new globalSettings();

export const getColorFromBucket = () => {
    switch (globals.colorStrategy) {
        case globals.colorSchemeStrategy:
            return '#' + globals.colorBucket[getRandomIntExclusive(0, globals.colorBucket.length)];
        case globals.niceColorPalettesStrategy:
            return globals.colorBucket[getRandomIntExclusive(0, globals.colorBucket.length)];
        case globals.googlePaletteStrategy:
            return '#' + globals.colorBucket[getRandomIntExclusive(0, globals.colorBucket.length)];
        default:
            throw 'no color scheme strategy';
    }
}

export const getNeutralFromBucket = () => {
    return globals.neutrals[getRandomIntExclusive(0, globals.neutrals.length)]
}

export const getLightFromBucket = () => {
    return globals.lights[getRandomIntExclusive(0, globals.lights.length)]
}

export const getColorSchemeStrategy = () => {
    return globals.colorSchemeStrategy;
}

export const getNiceColorPalettesStrategy = () => {
    return globals.niceColorPalettesStrategy;
}

export const getGooglePaletteStrategy = () => {
    return globals.googlePaletteStrategy;
}

export const getGooglePaletteSelector = () => {
    return globals.googlePaletteSelector;
}

export const getColorStrategy = () => {
    return globals.colorStrategy;
}

export const getSchemeInfo = () => {

    if (globals.colorStrategy === globals.colorSchemeStrategy) {
        return {
            scheme: globals.scheme, variations: globals.variations, hue: globals.hue, distance: globals.distance
        }
    }

    throw 'color-scheme strategy not selected'
}

export const getWorkingDirectory = () => {
    return globals.workingDirectory;
}

export const getFinalImageSize = () => {
    return {
        width: globals.finalImageWidth, height: globals.finalImageHeight
    }
}

export const getLayerStrategy = () => {
    return globals.layerStrategy;
}

export const getCanvasStrategy = () => {
    return globals.canvasStrategy;
}

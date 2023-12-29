import {ColorScheme as internalColorScheme} from "./ColorScheme.js";
import ColorScheme from "color-scheme"
import {getRandomIntExclusive, randomNumber} from "../math/random.js";

export class ColorSchemeJsFactory {
    constructor() {
    }

    static availableSchemes = {
        mono: 'mono',
        contrast: 'contrast',
        triade: 'triade',
        tetrade: 'tetrade',
        analogic: 'analogic',
    }

    static availableVariations = {
        default: 'default',
        pastel: 'pastel',
        soft: 'soft',
        light: 'light',
        hard: 'hard',
        pale: 'pale',
    }

    static getColorSchemeJsColorScheme({
                                           scheme = this.availableSchemes.triade,
                                           variation = this.availableVariations.hard,
                                           hue = getRandomIntExclusive(0, 360),
                                           distance = randomNumber(0, 1)
                                       }) {

        this.scheme = scheme;
        this.variations = variation;
        this.hue = hue;
        this.distance = distance;

        const bucket = new ColorScheme();

        this.colorBucket = bucket.from_hue(this.hue)
            .scheme(this.scheme)
            .variation(this.variations)
            .distance(this.distance.toFixed(2))
            .add_complement(true)
            .colors();

        return new internalColorScheme({
            colorBucket: this.colorBucket,
            colorSchemeInfo: () => {
                const schemeInfo = {
                    scheme: this.scheme, variations: this.variations, hue: this.hue, distance: this.distance
                };

                return `Color Strategy: color-scheme\nHue: ${schemeInfo.hue}\nScheme: ${schemeInfo.scheme}\nVariation: ${schemeInfo.variations}\nDistance: ${schemeInfo.distance.toFixed(2)}\n`
            }
        });
    }

}
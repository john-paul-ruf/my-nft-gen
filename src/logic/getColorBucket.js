import {getRandomInt} from "./random.js";
import ColorScheme from "color-scheme";

export const getColorBucket = () => {

    const schemeBucket = [/*'mono',*/ 'contrast', 'triade', 'tetrade', 'analogic'];
    const variationBucket = ['default', /*'pastel', 'soft', 'light',*/ 'hard', /*'pale',*/];

    const scheme = new ColorScheme();
    return scheme.from_hue(getRandomInt(0,360))
        .scheme(schemeBucket[getRandomInt(0, schemeBucket.length)])
        .variation(variationBucket[getRandomInt(0, variationBucket.length)])
        .colors();
}
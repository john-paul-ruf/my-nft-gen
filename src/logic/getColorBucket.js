import ColorScheme from "color-scheme";
import {HUE,SCHEME, VARIATION} from "./gobals.js";
import {randomNumber} from "./random.js";
export const getColorBucket = () => {
    const bucket = new ColorScheme();
    return bucket.from_hue(HUE)
        .scheme(SCHEME)
        .distance(randomNumber(0.4,1))
        .variation(VARIATION)
        .colors();
}
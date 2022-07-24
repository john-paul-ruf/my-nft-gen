import ColorScheme from "color-scheme";
import {HUE,SCHEME, VARIATION} from "./gobals.js";
export const getColorBucket = () => {
    const bucket = new ColorScheme();
    return bucket.from_hue(HUE)
        .scheme(SCHEME)
        .variation(VARIATION)
        .colors();
}
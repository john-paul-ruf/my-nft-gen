import ColorScheme from "color-scheme";
import {DISTANCE, HUE, SCHEME, VARIATION} from "./gobals.js";

export const getColorBucket = () => {
    const bucket = new ColorScheme();
    return bucket.from_hue(HUE)
        .scheme(SCHEME)
        .distance(DISTANCE)
        .variation(VARIATION)
        .colors();
}
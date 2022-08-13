import ColorScheme from "color-scheme";
import {getSchemeInfo} from "../core/gobals.js";

export const getColorBucket = () => {

    const schemeInfo = getSchemeInfo();

    const bucket = new ColorScheme();

    return bucket.from_hue(schemeInfo.hue)
        .scheme(schemeInfo.scheme)
        .distance(schemeInfo.distance)
        .variation(schemeInfo.variations)
        .colors();
}
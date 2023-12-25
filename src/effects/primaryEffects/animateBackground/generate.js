import {animateBackgroundEffect} from "./effect.js";

export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    return {
        width: finalImageSize.width,
        height: finalImageSize.height,
        color1: await settings.getNeutralFromBucket(),
        color2: await settings.getNeutralFromBucket(),
        color3: await settings.getColorFromBucket(),
        getInfo: () => {
            return 'animated-background'
        }
    };
}

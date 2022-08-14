import {findValue} from "../../../../core/math/findValue.js";

export const blur = async (layer, data, currentFrame, totalFrames) => {
    const blurGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    if (blurGaston > 0) {
        await layer.blur(blurGaston);
    }
}

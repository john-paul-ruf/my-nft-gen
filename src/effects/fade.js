import {findValue} from "../logic/findValue.js";

export const fadeAnimated = async (img, times, fadeLowerRange, fadeUpperRange, currentFrame, totalFrame) => {
    const opacity = findValue(fadeLowerRange, fadeUpperRange, times, totalFrame, currentFrame)
    await img.opacity(opacity);
}

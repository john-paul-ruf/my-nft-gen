import {findValue} from "../logic/findValue.js";

export const glowAnimated = async (img, times, glowLowerRange, glowUpperRange, currentFrame, totalFrame) => {
    const hue = findValue(glowLowerRange, glowUpperRange, times, totalFrame, currentFrame)
    await img.color([{apply: 'hue', params: [hue]}]);
}
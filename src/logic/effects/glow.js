export const glowAnimated = async (img, glowLowerRange, glowUpperRange, currentFrame, totalFrame) => {
    const findValue = (min, max) => {
        const range = max - min;
        const step = range / (totalFrame/2);

        if (currentFrame <= (totalFrame/2)) {
            return min + (step * currentFrame);
        }

        return max - (step * (currentFrame - (totalFrame/2)));
    }

    const hue = findValue(glowLowerRange, glowUpperRange)
    await img.color([{apply: 'hue', params: [hue]}]);
}
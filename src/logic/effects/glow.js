export const glowAnimated = async (img, fadeTimes, glowLowerRange, glowUpperRange, currentFrame, totalFrame) => {
    const findValue = (min, max) => {
        const range = max - min;
        const segment = totalFrame / fadeTimes;
        const halfSegment = segment / 2;
        const frameSegment = currentFrame % segment;
        const step = range / (segment / 2);

        if (frameSegment <= halfSegment) {
            return min + (step * frameSegment);
        }

        return max - (step * (frameSegment - halfSegment));
    }

    const hue = findValue(glowLowerRange, glowUpperRange)
    await img.color([{apply: 'hue', params: [hue]}]);
}
export const fadeAnimated = async (img, fadeTimes, fadeLowerRange, fadeUpperRange, currentFrame, totalFrame) => {
    const findValue = (min, max) => {
        const range = max - min;
        const segment = totalFrame / fadeTimes;
        const halfSegment = segment / 2;
        const frameSegment = currentFrame % segment;
        const step = range / (segment / 2);

        if (frameSegment <= halfSegment) {
            return min + (step * currentFrame);
        }

        return max - (step * (frameSegment - halfSegment));
    }

    const opacity = findValue(fadeLowerRange, fadeUpperRange)
    await img.opacity(opacity);
}

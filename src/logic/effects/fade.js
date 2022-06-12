export const fadeAnimated = async (img, fadeLowerRange, fadeUpperRange, currentFrame, totalFrame) => {
    const findValue = (min, max) => {
        const range = max - min;
        const step = range / (totalFrame / 2);

        if (currentFrame <= (totalFrame / 2)) {
            return min + (step * currentFrame);
        }

        return max - (step * (currentFrame - (totalFrame / 2)));
    }

    const opacity = findValue(fadeLowerRange, fadeUpperRange)
    await img.opacity(opacity);
}

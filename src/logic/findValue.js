export const findValue = (min, max, times, totalFrame, currentFrame) => {
    const range = max - min;
    const segment = totalFrame / times;
    const halfSegment = segment / 2;
    const frameSegment = currentFrame % segment;
    const step = range / (segment / 2);

    if (frameSegment <= halfSegment) {
        return min + (step * frameSegment);
    }

    return max - (step * (frameSegment - halfSegment));
}
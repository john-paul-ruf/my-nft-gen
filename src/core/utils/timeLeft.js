import { timeToString } from './timeToString.js';

export const timeLeft = (startTime, frame, frameInc, numberOfFrames) => {
    const currentTime = new Date();
    const rez = currentTime.getTime() - startTime.getTime();
    const currentFrameCount = (frame / frameInc);
    const timePerFrame = rez / currentFrameCount;
    const timeLeft = (numberOfFrames - currentFrameCount) * timePerFrame;
    return timeToString(timeLeft);
};

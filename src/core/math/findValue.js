import { getRandomIntExclusive } from "./random.js";

/**
 * Loop-safe algorithms for oscillating values between min and max.
 */
export const FindValueAlgorithm = {
    TRIANGLE: 'triangle',
    COSINE_BELL: 'cosineBell',
    SMOOTHSTEP: 'smoothstepLoopSafe',
};

/**
 * Get a random loop-safe algorithm from the list.
 * @returns {string}
 */
export const getRandomFindValueAlgorithm = () => {
    const algos = Object.values(FindValueAlgorithm);
    return algos[getRandomIntExclusive(0, algos.length)];
};

/**
 * Calculate a looping value between min and max based on the selected algorithm.
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} times - Number of oscillation cycles over totalFrame
 * @param {number} totalFrame - Total frames in the loop
 * @param {number} currentFrame - Current frame
 * @param {string} algorithm - Algorithm from FindValueAlgorithm
 * @param {number} [precision=10000] - Optional precision to reduce float drift
 * @returns {number}
 */
export const findValue = (
    min,
    max,
    times,
    totalFrame,
    currentFrame,
    algorithm = FindValueAlgorithm.COSINE_BELL,
    precision = 10000
) => {
    const range = max - min;
    const tRaw = (currentFrame / totalFrame) * times;
    const t = Math.round(tRaw * precision) / precision;
    const segment = totalFrame / times;

    switch (algorithm) {
        case FindValueAlgorithm.TRIANGLE: {
            const localFrame = currentFrame % segment;
            const half = segment / 2;
            const step = range / half;
            return localFrame <= half
                ? min + step * localFrame
                : max - step * (localFrame - half);
        }

        case FindValueAlgorithm.COSINE_BELL: {
            const phase = t * Math.PI * 2;
            const value = (1 - Math.cos(phase)) / 2;
            return min + value * range;
        }

        case FindValueAlgorithm.SMOOTHSTEP: {
            const phase = (t % 1) * Math.PI;
            const value = Math.pow(Math.sin(phase), 2); // sin² waveform
            return min + value * range;
        }

        default:
            return min;
    }
};
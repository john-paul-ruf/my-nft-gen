import { getRandomIntExclusive } from "./random.js";

/**
 * Loop-safe algorithms for oscillating values between min and max.
 */
export const FindValueAlgorithm = {
    /*TRIANGLE: 'triangle',
    COSINE_BELL: 'cosineBell',
    SMOOTHSTEP_LOOPSAFE: 'smoothstepLoopSafe',
    PARABOLIC_BELL: 'parabolicBell',
    ABS_SINE: 'absSine',
    TRIANGLE_ABS: 'triangleAbs',
    EASE_IN_OUT_CUBIC: 'easeInOutCubic',*/

    // New "journey-style" algorithms
    JOURNEY_SIN: 'journeySin',
    JOURNEY_SIN_SQUARED: 'journeySinSquared',
    JOURNEY_EXP_ENVELOPE: 'journeyExpEnvelope',
    JOURNEY_STEEP_BELL: 'journeySteepBell',
    JOURNEY_FLAT_TOP: 'journeyFlatTop',
};


/**
 * Get a random loop-safe algorithm from the list.
 * @returns {string}
 */
export const getRandomFindValueAlgorithm = () => {
    const algos = Object.values(FindValueAlgorithm);
    return algos[getRandomIntExclusive(0, algos.length)];
};

export const getAllFindValueAlgorithms = () => {
    return Object.values(FindValueAlgorithm);
};

/**
 * Calculate a looping value between min and max based on the selected algorithm.
 * Handles edge case where max === min (flat line).
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
    algorithm = FindValueAlgorithm.JOURNEY_SIN,
    precision = 10000
) => {
    if (max === min || totalFrame === 0 || times === 0) return min;

    const range = max - min;
    const tRaw = (currentFrame / totalFrame) * times;
    const t = Math.round(tRaw * precision) / precision;
    const segment = totalFrame / times;

    let value = 0;

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
            value = (1 - Math.cos(phase)) / 2;
            break;
        }

        case FindValueAlgorithm.SMOOTHSTEP_LOOPSAFE: {
            const phase = (t % 1) * Math.PI;
            value = Math.pow(Math.sin(phase), 2);
            break;
        }

        case FindValueAlgorithm.PARABOLIC_BELL: {
            const tt = t % 1;
            value = 4 * tt * (1 - tt);
            break;
        }

        case FindValueAlgorithm.ABS_SINE: {
            const phase = (t % 1) * Math.PI;
            value = Math.abs(Math.sin(phase));
            break;
        }

        case FindValueAlgorithm.TRIANGLE_ABS: {
            const tt = t % 1;
            value = 1 - Math.abs(2 * tt - 1);
            break;
        }

        case FindValueAlgorithm.EASE_IN_OUT_CUBIC: {
            const tt = t % 1;
            const easing = tt < 0.5
                ? 4 * Math.pow(tt, 3)
                : 1 - Math.pow(-2 * tt + 2, 3) / 2;
            value = easing * (1 - easing) * 4; // loop-safe cubic bell
            break;
        }

        case FindValueAlgorithm.JOURNEY_SIN: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_SIN_SQUARED: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 2);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_EXP_ENVELOPE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 0.5);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_STEEP_BELL: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 3);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_FLAT_TOP: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = 1 - Math.pow(Math.cos(Math.PI * normalizedT), 6);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT);
            value = Math.abs(envelope * modulation);
            break;
        }

        default:
            value = 0;
            break;
    }

    return min + value * range;
};

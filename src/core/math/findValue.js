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
    
    // Variety algorithms with diverse motion patterns
    INVERTED_BELL: 'invertedBell',
    DOUBLE_PEAK: 'doublePeak',
    EXPONENTIAL_DECAY: 'exponentialDecay',
    ELASTIC_BOUNCE: 'elasticBounce',
    BREATHING: 'breathing',
    PULSE_WAVE: 'pulseWave',
    RIPPLE: 'ripple',
    HEARTBEAT: 'heartbeat',
    WAVE_CRASH: 'waveCrash',
    VOLCANIC: 'volcanic',
    SPIRAL_OUT: 'spiralOut',
    SPIRAL_IN: 'spiralIn',
    MOUNTAIN_RANGE: 'mountainRange',
    OCEAN_TIDE: 'oceanTide',
    BUTTERFLY: 'butterfly',
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
 * Generate a deterministic phase offset for an algorithm to create staggered peaks
 * @param {string} algorithm - Algorithm name
 * @returns {number} Phase offset between 0 and 1
 */
const getAlgorithmPhaseOffset = (algorithm) => {
    const phaseOffsets = {
        [FindValueAlgorithm.JOURNEY_SIN]: 0,
        [FindValueAlgorithm.JOURNEY_SIN_SQUARED]: 0.1,
        [FindValueAlgorithm.JOURNEY_EXP_ENVELOPE]: 0.2,
        [FindValueAlgorithm.JOURNEY_STEEP_BELL]: 0.3,
        [FindValueAlgorithm.JOURNEY_FLAT_TOP]: 0.4,
        [FindValueAlgorithm.INVERTED_BELL]: 0.15,
        [FindValueAlgorithm.DOUBLE_PEAK]: 0.25,
        [FindValueAlgorithm.EXPONENTIAL_DECAY]: 0.35,
        [FindValueAlgorithm.ELASTIC_BOUNCE]: 0.45,
        [FindValueAlgorithm.BREATHING]: 0.05,
        [FindValueAlgorithm.PULSE_WAVE]: 0.55,
        [FindValueAlgorithm.RIPPLE]: 0.65,
        [FindValueAlgorithm.HEARTBEAT]: 0.75,
        [FindValueAlgorithm.WAVE_CRASH]: 0.85,
        [FindValueAlgorithm.VOLCANIC]: 0.95,
        [FindValueAlgorithm.SPIRAL_OUT]: 0.125,
        [FindValueAlgorithm.SPIRAL_IN]: 0.375,
        [FindValueAlgorithm.MOUNTAIN_RANGE]: 0.625,
        [FindValueAlgorithm.OCEAN_TIDE]: 0.875,
        [FindValueAlgorithm.BUTTERFLY]: 0.5,
    };
    return phaseOffsets[algorithm] || 0;
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
    
    // Get phase offset for this algorithm
    const phaseOffset = getAlgorithmPhaseOffset(algorithm);

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
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_SIN_SQUARED: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 2);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_EXP_ENVELOPE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 0.5);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_STEEP_BELL: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.pow(Math.sin(Math.PI * normalizedT), 3);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.JOURNEY_FLAT_TOP: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = 1 - Math.pow(Math.cos(Math.PI * normalizedT), 6);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * modulation);
            break;
        }

        case FindValueAlgorithm.INVERTED_BELL: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const inverted = envelope * (1 - Math.abs(Math.sin(Math.PI * normalizedT)));
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * inverted * modulation);
            break;
        }

        case FindValueAlgorithm.DOUBLE_PEAK: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const doublePeak = Math.sin(2 * Math.PI * normalizedT);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * doublePeak * modulation);
            break;
        }

        case FindValueAlgorithm.EXPONENTIAL_DECAY: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const decay = Math.exp(-5 * normalizedT) + Math.exp(-5 * (1 - normalizedT));
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * decay * modulation);
            break;
        }

        case FindValueAlgorithm.ELASTIC_BOUNCE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const elastic = Math.exp(-3 * Math.abs(normalizedT - 0.5)) * Math.cos(20 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * elastic * modulation);
            break;
        }

        case FindValueAlgorithm.BREATHING: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const breathing = Math.pow(Math.sin(Math.PI * normalizedT), 4);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * breathing * modulation);
            break;
        }

        case FindValueAlgorithm.PULSE_WAVE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const pulseT = (normalizedT + phaseOffset) % 1;
            const pulse = pulseT < 0.3 || pulseT > 0.7 ? 1 : 0.3;
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * pulse * modulation);
            break;
        }

        case FindValueAlgorithm.RIPPLE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const ripple = Math.exp(-10 * Math.pow(normalizedT - 0.5, 2)) * Math.cos(15 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * ripple * modulation);
            break;
        }

        case FindValueAlgorithm.HEARTBEAT: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const offsetT = (normalizedT + phaseOffset) % 1;
            const beat1 = Math.exp(-50 * Math.pow(offsetT - 0.3, 2));
            const beat2 = Math.exp(-50 * Math.pow(offsetT - 0.7, 2));
            const heartbeat = beat1 + beat2;
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * heartbeat * modulation);
            break;
        }

        case FindValueAlgorithm.WAVE_CRASH: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const offsetT = (normalizedT + phaseOffset) % 1;
            const buildup = Math.pow(offsetT, 3);
            const crash = offsetT > 0.7 ? Math.exp(-20 * (offsetT - 0.7)) : buildup;
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * crash * modulation);
            break;
        }

        case FindValueAlgorithm.VOLCANIC: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const offsetT = (normalizedT + phaseOffset) % 1;
            const pressure = Math.pow(offsetT, 2) * (1 - offsetT);
            const chaos = Math.sin(50 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI + 7) * 0.25 + 0.75;
            const eruption = offsetT > 0.6 ? chaos : pressure;
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * eruption * modulation);
            break;
        }

        case FindValueAlgorithm.SPIRAL_OUT: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const spiral = normalizedT * Math.cos(8 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * spiral * modulation);
            break;
        }

        case FindValueAlgorithm.SPIRAL_IN: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const spiral = (1 - normalizedT) * Math.cos(8 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * spiral * modulation);
            break;
        }

        case FindValueAlgorithm.MOUNTAIN_RANGE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const offsetT = (normalizedT + phaseOffset) % 1;
            const peak1 = Math.exp(-20 * Math.pow(offsetT - 0.2, 2));
            const peak2 = Math.exp(-15 * Math.pow(offsetT - 0.5, 2));
            const peak3 = Math.exp(-25 * Math.pow(offsetT - 0.8, 2));
            const mountains = (peak1 + peak2 + peak3) / 3; // Normalize to prevent overflow
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * mountains * modulation);
            break;
        }

        case FindValueAlgorithm.OCEAN_TIDE: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const tide = Math.sin(Math.PI * normalizedT) * Math.sin(3 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI);
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * tide * modulation);
            break;
        }

        case FindValueAlgorithm.BUTTERFLY: {
            const normalizedT = currentFrame / (totalFrame - 1);
            const envelope = Math.sin(Math.PI * normalizedT);
            const offsetT = (normalizedT + phaseOffset) % 1;
            const wing1 = Math.exp(-10 * Math.pow(offsetT - 0.25, 2));
            const wing2 = Math.exp(-10 * Math.pow(offsetT - 0.75, 2));
            const flutter = Math.sin(40 * Math.PI * normalizedT + phaseOffset * 2 * Math.PI) * 0.1 + 1;
            const butterfly = (wing1 + wing2) * flutter / 2; // Normalize to prevent overflow
            const modulation = Math.sin(2 * Math.PI * times * normalizedT + phaseOffset * 2 * Math.PI);
            value = Math.abs(envelope * butterfly * modulation);
            break;
        }

        default:
            value = 0;
            break;
    }

    return min + value * range;
};

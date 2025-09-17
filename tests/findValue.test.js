import { findValue, FindValueAlgorithm } from '../src/core/math/findValue.js';

test('findValue: begin and end match', () => {
    const min = 0;
    const max = 18;
    const times = 1;
    const totalFrame = 100;

    const beginValue = Math.floor(findValue(min, max, times, totalFrame, 0));
    const endValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, inverted', () => {
    const min = 0;
    const max = 18;
    const times = 1;
    const totalFrame = 100;

    const beginValue = Math.floor(findValue(min, max, times, totalFrame, 0, true));
    const endValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame, true));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, 2 amount of times', () => {
    const min = 0;
    const max = 18;
    const times = 2;
    const totalFrame = 100;

    const beginValue = Math.floor(findValue(min, max, times, totalFrame, 0));
    const endValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, 2 amount of times, inverted', () => {
    const min = 0;
    const max = 18;
    const times = 2;
    const totalFrame = 100;

    const beginValue = Math.floor(findValue(min, max, times, totalFrame, 0, true));
    const endValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame, true));

    expect(beginValue).toBe(endValue);
});

test('findValue: midpoint match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame / 2));

    expect(midPointValue).toBe(max);
});

test('findValue: midpoint match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, totalFrame / 2, true));

    expect(midPointValue).toBe(min);
});

test('findValue: left quarter match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, 25));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: left quarter match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, 25, true));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: right quarter match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, 75));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: right match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(findValue(min, max, times, totalFrame, 75, true));

    expect(midPointValue).toBe(max / 2);
});

// Comprehensive tests for all algorithm types
// Each algorithm should start and end at the same value for loop consistency

describe('findValue: All Algorithm Types - Loop Consistency', () => {
    const testParams = {
        min: 0,
        max: 20,
        times: 1,
        totalFrame: 100
    };

    // Get all algorithm values
    const algorithms = Object.values(FindValueAlgorithm);

    algorithms.forEach(algorithm => {
        test(`${algorithm}: start and end values match`, () => {
            const startValue = findValue(
                testParams.min,
                testParams.max,
                testParams.times,
                testParams.totalFrame,
                0,
                algorithm
            );

            const endValue = findValue(
                testParams.min,
                testParams.max,
                testParams.times,
                testParams.totalFrame,
                testParams.totalFrame,
                algorithm
            );

            // Values should be nearly identical for perfect loop consistency
            const difference = Math.abs(startValue - endValue);

            // Near-zero tolerance for perfect loops
            const maxAllowedDiff = 0.001;

            expect(difference).toBeLessThan(maxAllowedDiff);
        });

        test(`${algorithm}: start and end values match with 2 cycles`, () => {
            const startValue = findValue(
                testParams.min,
                testParams.max,
                2, // 2 cycles
                testParams.totalFrame,
                0,
                algorithm
            );

            const endValue = findValue(
                testParams.min,
                testParams.max,
                2, // 2 cycles
                testParams.totalFrame,
                testParams.totalFrame,
                algorithm
            );

            // Values should be nearly identical for perfect loop consistency
            const difference = Math.abs(startValue - endValue);

            // Near-zero tolerance for perfect loops
            const maxAllowedDiff = 0.001;

            expect(difference).toBeLessThan(maxAllowedDiff);
        });

        test(`${algorithm}: values stay within bounds`, () => {
            const framesToTest = [0, 25, 50, 75, 100];

            framesToTest.forEach(frame => {
                const value = findValue(
                    testParams.min,
                    testParams.max,
                    testParams.times,
                    testParams.totalFrame,
                    frame,
                    algorithm
                );

                expect(value).toBeGreaterThanOrEqual(testParams.min);
                expect(value).toBeLessThanOrEqual(testParams.max);
            });
        });
    });
});

// Identify algorithms with significant loop inconsistencies
describe('findValue: Loop Consistency Analysis', () => {
    test('identify algorithms with significant loop inconsistencies', () => {
        const testParams = {
            min: 0,
            max: 20,
            times: 1,
            totalFrame: 100
        };

        const algorithms = Object.values(FindValueAlgorithm);
        const problematicAlgorithms = [];

        algorithms.forEach(algorithm => {
            const startValue = findValue(
                testParams.min,
                testParams.max,
                testParams.times,
                testParams.totalFrame,
                0,
                algorithm
            );

            const endValue = findValue(
                testParams.min,
                testParams.max,
                testParams.times,
                testParams.totalFrame,
                testParams.totalFrame,
                algorithm
            );

            const difference = Math.abs(startValue - endValue);
            const percentageDiff = (difference / testParams.max) * 100;

            if (difference > 0.5) { // More than 0.5 absolute difference (2.5% of range)
                problematicAlgorithms.push({
                    algorithm,
                    difference: difference.toFixed(4),
                    percentage: percentageDiff.toFixed(2)
                });
            }
        });

        // Log problematic algorithms for visibility
        if (problematicAlgorithms.length > 0) {
            console.warn('\n⚠ Algorithms with significant loop inconsistencies:');
            problematicAlgorithms.forEach(({ algorithm, difference, percentage }) => {
                console.warn(`  - ${algorithm}: ${difference} difference (${percentage}% of range)`);
            });
            console.warn('These algorithms may cause visible jumps in looped animations.\n');
        }

        // For now, just ensure we don't have more than 5 highly problematic algorithms
        expect(problematicAlgorithms.length).toBeLessThanOrEqual(5);
    });
});

// Test edge cases for all algorithms
describe('findValue: Edge Cases for All Algorithms', () => {
    const algorithms = Object.values(FindValueAlgorithm);

    algorithms.forEach(algorithm => {
        test(`${algorithm}: handles min === max (flat line)`, () => {
            const flatValue = 10;

            const result = findValue(
                flatValue,
                flatValue,
                1,
                100,
                50,
                algorithm
            );

            expect(result).toBe(flatValue);
        });

        test(`${algorithm}: handles zero times (no oscillation)`, () => {
            const result = findValue(
                0,
                20,
                0, // zero times
                100,
                50,
                algorithm
            );

            expect(result).toBe(0); // Should return min
        });

        test(`${algorithm}: handles zero totalFrame`, () => {
            const result = findValue(
                0,
                20,
                1,
                0, // zero totalFrame
                0,
                algorithm
            );

            expect(result).toBe(0); // Should return min
        });
    });
});

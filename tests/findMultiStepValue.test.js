import {FindMultiStepStepValue} from "../src/core/math/FindMultiStepValue.js";
import {MultiStepDefinition} from "../src/core/math/MultiStepDefinition.js";
import {findValue} from "../src/core/math/findValue.js";

test('findValue: Three Steps - Step One', () => {

    const totalFrame = 1000;
    const currentFrame = 125;

    const stepOne = new MultiStepDefinition({
        minPercentage: 0,
        maxPercentage: 25,
        min: 0,
        max: 100,
        times: 2,
        invert: false
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        min: 0,
        max: 25,
        times: 4,
        invert: false
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        min: 0,
        max: 50,
        times: 5,
        invert: false
    });

    const stepMidpoint = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: currentFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(stepMidpoint).toBe(findValue(
        stepOne.min,
        stepOne.max,
        stepOne.times,
        250,
        125,
        stepOne.invert,
    ));
});

test('findValue: Three Steps - Step Two', () => {
    const totalFrame = 1000;
    const currentFrame = 500;

    const stepOne = new MultiStepDefinition({
        minPercentage: 0,
        maxPercentage: 25,
        min: 0,
        max: 100,
        times: 2,
        invert: false
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        min: 0,
        max: 25,
        times: 4,
        invert: false
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        min: 0,
        max: 50,
        times: 5,
        invert: false
    });

    const stepMidpoint = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: currentFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(stepMidpoint).toBe(findValue(
        stepTwo.min,
        stepTwo.max,
        stepTwo.times,
        500,
        250,
        stepTwo.invert));
});

test('findValue: Three Steps - Step Three', () => {
    const totalFrame = 1000;
    const currentFrame = 875;

    const stepOne = new MultiStepDefinition({
        minPercentage: 0,
        maxPercentage: 25,
        min: 0,
        max: 100,
        times: 2,
        invert: false
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        min: 0,
        max: 25,
        times: 4,
        invert: false
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        min: 0,
        max: 50,
        times: 5,
        invert: false
    });

    const stepMidpoint = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: currentFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(stepMidpoint).toBe(findValue(
        stepThree.min,
        stepThree.max,
        stepThree.times,
        250,
        125,
        stepThree.invert));
});


test('findValue: begin and end match', () => {
    const min = 0;
    const max = 18;
    const times = 1;
    const totalFrame = 100;

    const beginValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: 0,
            totalNumberOfFrames: totalFrame
        }));

    const endValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: totalFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, inverted', () => {
    const min = 0;
    const max = 18;
    const times = 1;
    const totalFrame = 100;

    const beginValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: 0,
            totalNumberOfFrames: totalFrame
        }));

    const endValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: totalFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, 2 amount of times', () => {
    const min = 0;
    const max = 18;
    const times = 2;
    const totalFrame = 100;

    const beginValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: 0,
            totalNumberOfFrames: totalFrame
        }));

    const endValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: totalFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(beginValue).toBe(endValue);
});

test('findValue: begin and end match, 2 amount of times, inverted', () => {
    const min = 0;
    const max = 18;
    const times = 2;
    const totalFrame = 100;

    const beginValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: 0,
            totalNumberOfFrames: totalFrame
        }));

    const endValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: totalFrame,
            totalNumberOfFrames: totalFrame
        }));

    expect(beginValue).toBe(endValue);
});

test('findValue: midpoint match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: totalFrame / 2,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max);
});

test('findValue: midpoint match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: totalFrame / 2,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(min);
});

test('findValue: left quarter match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: 25,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: left quarter match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: 25,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: right quarter match', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: false
                })
            ],
            currentFrame: 75,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max / 2);
});

test('findValue: right match, inverted', () => {
    const min = 0;
    const max = 20;
    const times = 1;
    const totalFrame = 100;

    const midPointValue = Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                new MultiStepDefinition({
                    minPercentage: 0,
                    maxPercentage: 100,
                    min: min,
                    max: max,
                    times: times,
                    invert: true
                })
            ],
            currentFrame: 75,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max / 2);
});

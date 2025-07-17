import {FindMultiStepStepValue} from "../src/core/math/FindMultiStepValue.js";
import {MultiStepDefinition} from "../src/core/math/MultiStepDefinition.js";
import {findValue} from "../src/core/math/findValue.js";


test('findValue: Three Steps - Step One to Step Two to Step Three - Change Invert', () => {

    const totalFrame = 1000;

    const stepOne = new MultiStepDefinition({
        minPercentage: 0,
        maxPercentage: 25,
        max: 100,
        times: 2,
        
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        max: 25,
        times: 4,
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        max: 50,
        times: 5,
        
    });

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 250,
            totalNumberOfFrames: totalFrame
        }))).toBe(0);

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 251,
            totalNumberOfFrames: totalFrame
        }))).toBe(0);

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 250,
            totalNumberOfFrames: totalFrame
        }))).toBe(0);

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 750,
            totalNumberOfFrames: totalFrame
        }))).toBe(0);

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 999,
            totalNumberOfFrames: totalFrame
        }))).toBe(2);

    expect(Math.floor(FindMultiStepStepValue.findValue(
        {
            stepArray: [
                stepOne,
                stepTwo,
                stepThree
            ],
            currentFrame: 0,
            totalNumberOfFrames: totalFrame
        }))).toBe(0);

});

test('findValue: Three Steps - Step One', () => {

    const totalFrame = 1000;
    const currentFrame = 125;

    const stepOne = new MultiStepDefinition({
        minPercentage: 0,
        maxPercentage: 25,
        max: 100,
        times: 2,
        
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        max: 25,
        times: 4,
        
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        max: 50,
        times: 5,
        
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
        0,
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
        max: 100,
        times: 2,
        
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        max: 25,
        times: 4,
        
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        max: 50,
        times: 5,
        
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
        0,
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
        max: 100,
        times: 2,
        
    });

    const stepTwo = new MultiStepDefinition({
        minPercentage: 25,
        maxPercentage: 75,
        max: 25,
        times: 4,
        
    });

    const stepThree = new MultiStepDefinition({
        minPercentage: 75,
        maxPercentage: 100,
        max: 50,
        times: 2,
        
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
        0,
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
                    max: max,
                    times: times,
                    
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
                    max: max,
                    times: times,
                    
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
                    max: max,
                    times: times,
                    
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
                    max: max,
                    times: times,
                    
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
                    max: max,
                    times: times,
                    
                })
            ],
            currentFrame: totalFrame / 2,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max);
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
                    max: max,
                    times: times,
                    
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
                    max: max,
                    times: times,
                    
                })
            ],
            currentFrame: 75,
            totalNumberOfFrames: totalFrame
        }));

    expect(midPointValue).toBe(max / 2);
});

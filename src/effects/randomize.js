import {getRandomInt} from "../logic/random.js";

const config = {
    spin: {lower: -360, upper: 360},
    red: {lower: 5, upper: 55},
    blue: {lower: 5, upper: 55},
    green: {lower: 5, upper: 55}
}

const generate = () => [
    {
        apply: 'hue',
        params: [getRandomInt(config.spin.lower, config.spin.upper)]
    },
    {
        apply: 'red',
        params: [getRandomInt(config.red.lower, config.red.upper)]
    },
    {
        apply: 'green',
        params: [getRandomInt(config.green.lower, config.green.upper)]
    },
    {
        apply: 'blue',
        params: [getRandomInt(config.blue.lower, config.blue.upper)]
    }
];

const randomize = async (img) => {
    const data = generate();
    await img.color(data);
}

export const randomizeStrategy = {
    invoke: (img) => randomize(img)
}

export const randomizeEffect = {
    name: 'randomize',
    effect: randomizeStrategy,
    effectChance: 100,
    requiresLayer: false,
}


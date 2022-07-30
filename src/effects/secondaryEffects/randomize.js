import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    spin: {lower: -360, upper: 360},
    red: {lower: -15, upper: 31},
    blue: {lower: -15, upper: 31},
    green: {lower: -15, upper: 31}
}

const generate = () => {

    const props = {
        hue: getRandomIntInclusive(config.spin.lower, config.spin.upper),
        red: getRandomIntInclusive(config.red.lower, config.red.upper),
        green: getRandomIntInclusive(config.green.lower, config.green.upper),
        blue: getRandomIntInclusive(config.blue.lower, config.blue.upper),
    }

    const data = {

        randomize: [
            {
                apply: 'hue',
                params: [props.hue]
            },
            {
                apply: 'red',
                params: [props.red]
            },
            {
                apply: 'green',
                params: [props.green]
            },
            {
                apply: 'blue',
                params: [props.blue]
            }
        ],
        getInfo: () => {
            return `${randomizeEffect.name}: hue: ${props.hue}, red: ${props.red}, green: ${props.green}, blue: ${props.blue}            `
        }
    }

    return data;
};

const randomize = async (data, img) => {
    await img.color(data.randomize);
}

export const effect = {
    invoke: (data, img) => randomize(data, img)
}

export const randomizeEffect = {
    name: 'randomize',
    generateData: generate,
    effect: effect,
    effectChance: 0, //checking the color scheme work
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

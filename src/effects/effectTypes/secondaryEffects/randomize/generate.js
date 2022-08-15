import {getRandomIntInclusive} from "../../../../core/math/random.js";
import {randomizeEffect} from "./effect.js";

const config = {
    spin: {lower: -12, upper: 12},
    red: {lower: -12, upper: 12},
    blue: {lower: -12, upper: 12},
    green: {lower: -12, upper: 12}
}

export const generate = () => {

    const props = {
        hue: getRandomIntInclusive(config.spin.lower, config.spin.upper),
        red: getRandomIntInclusive(config.red.lower, config.red.upper),
        green: getRandomIntInclusive(config.green.lower, config.green.upper),
        blue: getRandomIntInclusive(config.blue.lower, config.blue.upper),
    }

    return {

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
};
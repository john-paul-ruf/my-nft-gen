import {getColorFromBucket, getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {randomNumber} from "../../../../core/math/random.js";
import {ampEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    sparsityFactor: {lower: 0.5, upper: 1},
    stroke: 0.5,
}

export const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 400,
        lineStart: 350,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}
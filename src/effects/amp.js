import { randomNumber} from "../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {drawRay2d} from "../draw/drawRay2d.js";

const config = {
    sparsityFactor: {lower: 1.25, upper: 1.75},
    size: IMAGESIZE,
    stroke: 2,
}

const generate = () => {
    const data = {
        sparsityFactor: randomNumber(config.sparsityFactor.lower, config.sparsityFactor.upper),
        height: config.size,
        width: config.size,
        color: getColorFromBucket(),
        innerColor: getColorFromBucket(),
        length: 275,
        lineStart: 350,
        center: {x:IMAGESIZE/2,y:IMAGESIZE/2},
        getInfo: () => {
            return `${ampEffect.name}: sparsity factor: ${data.sparsityFactor.toFixed(3)}`
        }
    }

    return data;
}

const amp = async (data, img, currentFrame, numberOfFrames, card) => {
    const drawing = Date.now().toString() + '-amp.png';

    const draw = async (stroke, filename) => {
        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        for(let i = 0; i < 360; i = i+ data.sparsityFactor)
        {
            drawRay2d(context, data.center, stroke, data.color, data.innerColor, i, data.lineStart, data.length )
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.stroke, drawing);

    let tmpImg = await Jimp.read(drawing);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(drawing);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => amp(data, img, currentFrame, totalFrames, card)
}

export const ampEffect = {
    name: 'amp',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: true,
    rotationTotalAngle: 20,
}


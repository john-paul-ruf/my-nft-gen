import {getRandomIntExclusive, getRandomIntInclusive} from "../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {drawPolygon2d} from "../draw/drawPolygon2d.js";
import {findValue} from "../logic/findValue.js";


const config = {
    gates: {lower: 5, upper: 11},
    numberOfSides: {lower: 6, upper: 16},
    thickness: 12,
    stroke: 6,
    size: IMAGESIZE,
}

const generate = () => {
    const data = {
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: config.size,
        width: config.size,
        thickness: config.thickness,
        stroke: config.stroke,
        innerColor: getColorFromBucket(),
        center: {x:IMAGESIZE/2,y:IMAGESIZE/2},
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(0, config.size / 2),
                color: getColorFromBucket(),
            });
        }
        return info;
    }

    data.gates = computeInitialInfo(data.numberOfGates);

    return data;
}

const gates = async (data, img, currentFrame, numberOfFrames, card) => {
    const drawing = Date.now().toString() + '-gate.png';
    const underlayName = Date.now().toString() + 'gate-accent.png';

    const draw = async (filename, accentBoost) => {
        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        for (let i = 0; i < data.numberOfGates; i++) {
            drawPolygon2d(context, data.gates[i].radius, data.center, data.numberOfSides, 0, data.thickness, data.innerColor, data.stroke+accentBoost, data.gates[i].color)
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(drawing,0);

    const theAccentGaston = findValue(0, 20, 1, numberOfFrames, currentFrame);
    await draw(underlayName, theAccentGaston);

    let underlayImg = await Jimp.read(underlayName);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));
    await underlayImg.blur(theBlurGaston);

    await underlayImg.opacity(0.5);

    await img.composite(underlayImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    let tmpImg = await Jimp.read(drawing);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    fs.unlinkSync(underlayName);
    fs.unlinkSync(drawing);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => gates(data, img, currentFrame, totalFrames, card)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false, //turning off rotation for now
    rotationTotalAngle: 45,
}


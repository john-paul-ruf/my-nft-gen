import {getRandomInt} from "../logic/random.js";
import {imageSize} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {drawRing2d} from "../draw/drawRing2d.js";
import {findValue} from "../logic/findValue.js";

const config = {
    circles: {lower: 10, upper: 20},
    fuzzFactor: {lower: 1, upper: 3},
    size: imageSize,
    stroke: 0.5,
    thickness: 2,
    scaleFactor: 1.15,
    innerColor: '#000000',
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',]
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomInt(config.circles.lower, config.circles.upper),
        fuzzFactor: getRandomInt(config.fuzzFactor.lower, config.fuzzFactor.upper),
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: config.innerColor,
        scaleFactor: config.scaleFactor,
        center: {x: config.size / 2, y: config.size / 2},
        getInfo: () => {
            return `${fuzzBandsEffect.name}: ${data.numberOfCircles} fuzzy bands`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomInt(0, config.size),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzzBands = async (data, img, currentFrame, numberOfFrames, card) => {
    const ring = Date.now().toString() + '-fuzzy-band.png';
    const fuzz = Date.now().toString() + '-fuzzy-band-underlay.png';

    const draw = async (stroke, filename, accentBoost) => {
        const canvas = createCanvas(imageSize, imageSize)
        const context = canvas.getContext('2d');

        const drawRing = (radius, stroke, color, scaleBy) => {
            drawRing2d(context, data.center, radius, data.thickness * scaleBy, data.innerColor, (data.stroke + accentBoost) * scaleBy, color)
        }

        for (let i = 0; i < data.numberOfCircles; i++) {
            const loopCount = i + 1;
            const scaleBy = (data.scaleFactor * loopCount);
            drawRing(data.circles[i].radius, stroke, data.circles[i].color, scaleBy);
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, ring);
    await draw(data.fuzzFactor + config.ringStroke, fuzz, 0);

    const theAccentGaston = findValue(0, 3, 1, numberOfFrames, currentFrame);
    await draw(config.ringStroke, fuzz, theAccentGaston);

    let fuzzImg = await Jimp.read(fuzz);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));
    await fuzzImg.blur(theBlurGaston);

    await fuzzImg.opacity(0.5);

    let ringImg = await Jimp.read(ring);

    await fuzzImg.blur(theBlurGaston);

    await img.composite(fuzzImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(ringImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

  /*  const compName = Date.now().toString() + 'hex-comp.png';
    img.write(compName);*/

    fs.unlinkSync(ring);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => fuzzBands(data, img, currentFrame, totalFrames, card)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


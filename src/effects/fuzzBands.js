import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../logic/random.js";
import {getColorFromBucket, IMAGESIZE} from "../logic/gobals.js";
import {createCanvas} from "canvas";
import Jimp from "jimp";
import fs from "fs";
import {drawRing2d} from "../draw/drawRing2d.js";
import {findValue} from "../logic/findValue.js";


const config = {
    circles: {lower: 8, upper: 20},
    size: IMAGESIZE,
    stroke: 0.5,
    thickness: 1,
    scaleFactor: 1.05,
}

const generate = () => {
    const data = {
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: config.size,
        width: config.size,
        stroke: config.stroke,
        thickness: config.thickness,
        innerColor: getColorFromBucket(),
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
                radius: getRandomIntExclusive(0, config.size * 0.75),
                color: getColorFromBucket(),
            });
        }
        return info;
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}

const fuzzBands = async (data, img, currentFrame, numberOfFrames, card) => {
    const ring = randomId() + '-fuzzy-band.png';
    const fuzz = randomId() + '-fuzzy-band-underlay.png';

    const draw = async (stroke, filename, accentBoost) => {
        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        for (let i = 0; i < data.numberOfCircles; i++) {
            const loopCount = i + 1;
            const scaleBy = (data.scaleFactor * loopCount);
            drawRing2d(context, data.center, data.circles[i].radius, data.thickness * scaleBy, data.innerColor, (data.stroke + accentBoost) * scaleBy, data.circles[i].color)
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filename, buffer);
    }

    await draw(config.ringStroke, ring);
    await draw(data.fuzzFactor + config.ringStroke, fuzz, 0);

    const theAccentGaston = findValue(0, 5, 1, numberOfFrames, currentFrame);
    await draw(config.ringStroke, fuzz, theAccentGaston);

    let fuzzImg = await Jimp.read(fuzz);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));
    await fuzzImg.blur(theBlurGaston);

    await fuzzImg.opacity(0.5);

    let ringImg = await Jimp.read(ring);

    await img.composite(fuzzImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    await img.composite(ringImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

  /*  const compName = randomId() + 'hex-comp.png';
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


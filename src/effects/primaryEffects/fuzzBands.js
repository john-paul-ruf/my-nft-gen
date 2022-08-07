import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {getColorFromBucket, IMAGESIZE, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/core/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {drawRing2d} from "../../draw/drawRing2d.js";
import {findValue} from "../../logic/math/findValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    circles: {lower: 8, upper: 20},
    size: IMAGESIZE,
    stroke: 0.5,
    thickness: 0.5,
    scaleFactor: 1.01,
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

const fuzzBands = async (data, layer, currentFrame, numberOfFrames) => {
    const ring = WORKINGDIRETORY + 'ring' + randomId() + '.png';
    const fuzz = WORKINGDIRETORY + 'fuzz' + randomId() + '.png';

    const draw = async (filename, accentBoost) => {
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

    await draw(ring, 0);

    const theAccentGaston = findValue(0, 5, 1, numberOfFrames, currentFrame);
    await draw(fuzz, theAccentGaston);

    let fuzzLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, fuzz);
    let ringLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, ring);

    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));

    await fuzzLayer.blur(theBlurGaston);
    await fuzzLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(fuzzLayer);
    await layer.compositeLayerOver(ringLayer);

    fs.unlinkSync(ring);
    fs.unlinkSync(fuzz);

}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => fuzzBands(data, layer, currentFrame, totalFrames)
}

export const fuzzBandsEffect = {
    name: 'fuzz-bands',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
}


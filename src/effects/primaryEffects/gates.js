import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../logic/random.js";
import {getColorFromBucket, IMAGESIZE, LAYERSTRATEGY, WORKINGDIRETORY} from "../../logic/gobals.js";
import {createCanvas} from "canvas";
import fs from "fs";
import {drawPolygon2d} from "../../draw/drawPolygon2d.js";
import {findValue} from "../../logic/findValue.js";
import {findOneWayValue} from "../../logic/findOneWayValue.js";
import {LayerFactory} from "../../layer/LayerFactory.js";


const config = {
    gates: {lower: 5, upper: 11},
    numberOfSides: {lower: 3, upper: 12},
    thickness: 6,
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
        center: {x: IMAGESIZE / 2, y: IMAGESIZE / 2},
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

const gates = async (data, layer, currentFrame, numberOfFrames) => {
    const drawing = WORKINGDIRETORY + 'gate' + randomId() + '.png';
    const underlayName = WORKINGDIRETORY + 'gate-underlay' + randomId() + '.png';

    const draw = async (filename, accentBoost) => {

        const canvas = createCanvas(IMAGESIZE, IMAGESIZE)
        const context = canvas.getContext('2d');

        for (let i = 0; i < data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = findOneWayValue(0, 360 / data.numberOfSides, numberOfFrames, currentFrame, invert);
            drawPolygon2d(context, data.gates[i].radius, data.center, data.numberOfSides, theAngleGaston, data.thickness, data.innerColor, data.stroke + accentBoost, data.gates[i].color)
        }

        const buffer = canvas.toBuffer('image/png');

        fs.writeFileSync(filename, buffer);
    }

    const theAccentGaston = findValue(0, 20, 1, numberOfFrames, currentFrame);
    const theBlurGaston = Math.ceil(findValue(1, 3, 1, numberOfFrames, currentFrame));

    await draw(drawing, 0);
    await draw(underlayName, theAccentGaston);

    let tempLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, drawing);
    let underlayLayer = await LayerFactory.getLayerFromFile(LAYERSTRATEGY, underlayName);

    await underlayLayer.blur(theBlurGaston);
    await underlayLayer.adjustLayerOpacity(0.5);

    await layer.compositeLayerOver(underlayLayer);
    await layer.compositeLayerOver(tempLayer);

    fs.unlinkSync(underlayName);
    fs.unlinkSync(drawing);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => gates(data, layer, currentFrame, totalFrames)
}

export const gatesEffect = {
    name: 'gates',
    generateData: generate,
    effect: effect,
    effectChance: 60,
    requiresLayer: true,
}


import {getRandomInt} from "../logic/random.js";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {imageSize} from "../logic/gobals.js";
import fs from "fs";
import Jimp from "jimp";

const config = {
    numberOfBalls: {lower: 1, upper: 5},
    rangeFromCenter: {lower:3, upper:5},
    counterClockwise: {lower: 0, upper: 2},
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
}

const generate = () => {
    const data = {
        imgCenter: {x:config.size/2,y:config.size/2},
        threeCenter: {x:0,y:0},
        numberOfBalls:getRandomInt(config.numberOfBalls.lower, config.numberOfBalls.upper),
        rangeFromCenter:getRandomInt(config.rangeFromCenter.lower, config.rangeFromCenter.upper),
        counterClockwise: getRandomInt(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${threeSigEffect.name}, balls: ${data.numberOfBalls}, range: ${data.rangeFromCenter}`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];

        for (let i = 0; i <= num; i++) {
            info.push({
                pos: findPointByAngleAndCircle(config.threeCenter, getRandomInt(0, 360), data.rangeFromCenter),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.balls = computeInitialInfo(data.numberOfBalls);

    return data;
}

const add3dSig = async (data, img, currentFrame, numberOfFrames) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(imageSize, imageSize);

    const createSphere = (radius, x, y, color) => {
        const geometry = new THREE.SphereGeometry(radius, 32, 16,);
        const material = new THREE.MeshNormalMaterial();
        material.color = new THREE.Color(color);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x,y, 0);
        scene.add(cube);
    }

    createSphere(5,0,0, '#000000');

    for (let i = 0; i < data.numberOfBalls; i++) {
        createSphere(1.5, data.balls[i].pos.x, data.balls[i].pos.y, data.balls[i].color);
    }

    const direction = data.counterClockwise > 0 ? -1 : 1;
    const cameraAngle = 360 * data.times / numberOfFrames * currentFrame * direction;
    const cameraPos = findPointByAngleAndCircle(config.threeCenter, cameraAngle, 20)

    camera.position.set(cameraPos.x,cameraPos.y, 0)
    camera.lookAt(0,0,0);

    const target = new THREE.WebGLRenderTarget(imageSize, imageSize)

    renderer.render(scene, camera, target)

    const pngStream = require('three-png-stream')
    const filename = Date.now().toString() + '-3dsig.png';

    const output = fs.createWriteStream(filename)
    pngStream(renderer, target).pipe(output)

    let tmpImg = await Jimp.read(filename);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });

    //fs.unlinkSync(filename);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => add3dSig(data, img, currentFrame, totalFrames)
}

export const threeSigEffect = {
    name: '3d-sig',
    generateData: generate,
    effect: effect,
    effectChance: 70,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false,
}


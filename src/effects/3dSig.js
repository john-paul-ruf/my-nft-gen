import {getRandomInt} from "../logic/random.js";
import {findPointByAngleAndCircle} from "../logic/drawingMath.js";
import {imageSize} from "../logic/gobals.js";
import fs from "fs";
import THREE from 'three'
import path, {dirname} from "path";
import {fileURLToPath} from "url";
import PNG from "node-png";
import SoftwareRenderer from "three-software-renderer";

/**
 *
 * No matter how I approach this one I get a solid black image on the output png
 *
 * @type {{times: {lower: number, upper: number}}}
 */

const config = {
    numberOfBalls: {lower: 1, upper: 5},
    rangeFromCenter: {lower: 3, upper: 5},
    counterClockwise: {lower: 0, upper: 2},
    colorBucket: ['#FF0000', '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#FFFF00',],
}

const generate = () => {
    const fileURLToPath1 = fileURLToPath(import.meta.url);

    const data = {
        imgCenter: {x: config.size / 2, y: config.size / 2},
        threeCenter: {x: 0, y: 0},
        numberOfBalls: getRandomInt(config.numberOfBalls.lower, config.numberOfBalls.upper),
        rangeFromCenter: getRandomInt(config.rangeFromCenter.lower, config.rangeFromCenter.upper),
        counterClockwise: getRandomInt(config.counterClockwise.lower, config.counterClockwise.upper),
        directory: dirname(fileURLToPath1).replace('/effects', ''),
        getInfo: () => {
            return `${threeSigEffect.name}, balls: ${data.numberOfBalls}, range: ${data.rangeFromCenter}`
        }
    }

    const computeInitialInfo = (num) => {
        const info = [];

        for (let i = 0; i <= num; i++) {
            info.push({
                pos: findPointByAngleAndCircle(data.threeCenter, 360 / num * i, data.rangeFromCenter),
                color: config.colorBucket[getRandomInt(0, config.colorBucket.length)],
            });
        }
        return info;
    }

    data.balls = computeInitialInfo(data.numberOfBalls);

    return data;
}

const add3dSig = async (data, img, currentFrame, numberOfFrames, card) => {

    /*const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 2000);
    scene.add(camera);

    const light = new THREE.AmbientLight(0xffaaff);
    light.position.set(10, 10, 10);
    scene.add(light);

    const createSphere = (radius, x, y, color) => {
        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        const material = new THREE.MeshNormalMaterial();
        material.color = new THREE.Color(color);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, 0);
        scene.add(cube);
    }

    createSphere(500, 0, 0, '#FFFFFF');

    for (let i = 0; i < data.numberOfBalls; i++) {
        createSphere(250, data.balls[i].pos.x, data.balls[i].pos.y, data.balls[i].color);
    }

    const direction = data.counterClockwise > 0 ? -1 : 1;
    const cameraAngle = 180 / numberOfFrames * currentFrame * direction;
    const cameraPos = findPointByAngleAndCircle(data.threeCenter, cameraAngle, 1000)

    camera.aspect = imageSize / imageSize
    camera.updateProjectionMatrix();
    camera.position.set(cameraPos.x, cameraPos.y, 0)
    camera.lookAt(0, 0, 0);*/

    const scene = new THREE.Scene();

// Set the background color
    scene.background = new THREE.Color('skyblue');

// Create a camera
    const fov = 35; // AKA Field of View
    const aspect = imageSize / imageSize;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

// create a geometry
    const geometry = new THREE.BufferGeometry(2, 2, 2);

// create a default (white) Basic material
    const material = new THREE.MeshBasicMaterial();

// create a Mesh containing the geometry and material
    const cube = new THREE.Mesh(geometry, material);

// add the mesh to the scene
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFC5CB, .8);
    pointLight.position.copy(camera.position);
    scene.add(pointLight);

    const filename = Date.now().toString() + '-3dsig.png';

    const renderer = new SoftwareRenderer({
        alpha: false
    });

    renderer.setSize(imageSize, imageSize);
    const imageData = renderer.render(scene, camera);

    const png = new PNG.PNG({
        width: imageSize,
        height: imageSize,
        colorType: 6
    });

    for (let i = 0; i < imageData.data.length; i++) {
        png.data[i] = imageData.data[i];
    }

    const options = {
        width: imageSize,
        height: imageSize,
        colorType: 6
    };
    let buffer = PNG.PNG.sync.write(png, options);
    fs.writeFileSync(filename, buffer);

    /*let tmpImg = await Jimp.read(filename);

    await img.composite(tmpImg, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    });*/

    //fs.unlinkSync(filename);

}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => add3dSig(data, img, currentFrame, totalFrames, card)
}

export const threeSigEffect = {
    name: '3d-sig',
    generateData: generate,
    effect: effect,
    effectChance: 0, //check top level comments
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}


import {Canvas3d} from "../../../../core/factory/canvas/Canvas3d.js";
import {randomId} from "../../../../core/math/random.js";
import fs from "fs";
import * as THREE from "three";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {findValue} from "../../../../core/math/findValue.js";
import {hexToRgba} from "../../../../core/utils/hexToRgba.js";
import {degreesToRadians} from "../../../../core/math/drawingMath.js";

const draw = async (context, filename) => {
    const finalImageSize = getFinalImageSize();

    const width = finalImageSize.width, height = finalImageSize.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const canvas = new Canvas3d(width, height);

    const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true
    });


    const geometry = new THREE.DodecahedronGeometry(20, 0);

    const wireframeMaterial = new THREE.MeshStandardMaterial({
        color: hexToRgba(context.data.color),
        transparent: true,
        opacity: 0.8,
        wireframe: true,
    });
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(wireframe);

    const material = new THREE.MeshStandardMaterial({
        color: hexToRgba(context.data.color),
        transparent: true,
        opacity: 0.8
    });
    const item = new THREE.Mesh(geometry, material);
    scene.add(item);

    const light = new THREE.SpotLight(hexToRgba(context.data.pointLight), 5, 300);
    light.position.set(50, 50, 50);
    scene.add(light);

    camera.position.z = 100;

    const theXGaston = findValue(0, 180, context.data.times, context.numberOfFrames, context.currentFrame);
    const theYGaston = findValue(0, 180, context.data.times, context.numberOfFrames, context.currentFrame);

    item.rotation.x += degreesToRadians(theXGaston);
    item.rotation.y += degreesToRadians(theYGaston);
    renderer.render(scene, camera);

    canvas.toFile(filename);
}


export const threeDimensionalShape = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        data: data,
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'three-dimensional-shape' + randomId() + '.png'
    }

    await draw(context, context.drawing)

    await layer.fromFile(context.drawing);

    fs.unlinkSync(context.drawing);
}
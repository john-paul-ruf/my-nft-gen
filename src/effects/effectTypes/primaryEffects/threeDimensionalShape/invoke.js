import {Canvas3d} from "../../../../core/factory/canvas/Canvas3d.js";
import {randomId} from "../../../../core/math/random.js";
import fs from "fs";
import * as THREE from "three";
import {getFinalImageSize, getWorkingDirectory} from "../../../../core/GlobalSettings.js";
import {hexToRgba} from "../../../../core/utils/hexToRgba.js";
import {degreesToRadians} from "../../../../core/math/drawingMath.js";
import {findOneWayValue} from "../../../../core/math/findOneWayValue.js";

const draw = async (context, filename) => {
    const finalImageSize = getFinalImageSize();

    const width = finalImageSize.width, height = finalImageSize.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const canvas = new Canvas3d(width, height);

    const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true
    });


    const geometry = new THREE.IcosahedronBufferGeometry(10);

    const material = new THREE.MeshPhongMaterial({
        color: hexToRgba(context.data.color),
        emissive: hexToRgba(context.data.emissive),
        specular: hexToRgba(context.data.specular),
        transparent: true,
        opacity: 0.75,
        polygonOffset: true,
        polygonOffsetUnits: 2,
        polygonOffsetFactor: 1,
        shininess: 100,
        flatShading: false
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({color: '#000000', wireframe: true, transparent: true});

    const mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);

    mesh.add(wireframe);

    scene.add(mesh);

    const light = new THREE.SpotLight(hexToRgba(context.data.light), 5, 300);
    light.position.set(50, 50, 50);
    scene.add(light);


    camera.position.z = 100;

    const theXGaston = findOneWayValue(0, 360 * context.data.times, context.numberOfFrames, context.currentFrame);
    const theYGaston = findOneWayValue(0, 360 * context.data.times, context.numberOfFrames, context.currentFrame);
    const theZGaston = findOneWayValue(0, 360 * context.data.times, context.numberOfFrames, context.currentFrame);

    mesh.rotation.x += degreesToRadians(theXGaston);
    mesh.rotation.y += degreesToRadians(theYGaston);
    mesh.rotation.z += degreesToRadians(theZGaston);

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
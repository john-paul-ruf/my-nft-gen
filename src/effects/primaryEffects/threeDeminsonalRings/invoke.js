import {Canvas3d} from "../../../core/factory/canvas/Canvas3d.js";
import {randomId} from "../../../core/math/random.js";
import fs from "fs";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import * as THREE from "three";

import {hexToRgba} from "../../../core/utils/hexToRgba.js";
import {degreesToRadians} from "../../../core/math/drawingMath.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";

const draw = async (context, filename) => {
    const finalImageSize = GlobalSettings.getFinalImageSize();

    const center = new THREE.Object3D();
    center.position.set(0, 0, 0);

    const width = finalImageSize.width, height = finalImageSize.height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);

    const canvas = new Canvas3d(width, height);

    const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true
    });

    for (let i = 0; i < context.data.rings; i++) {

        const innerRadius = context.data.radiusConstant + (context.data.ringGap * (i + 1))

        const geometry = new THREE.CylinderGeometry(innerRadius, innerRadius, context.data.ringsInstances[i].height, 64, 1, true);

        const material = new THREE.MeshStandardMaterial({
            color: hexToRgba(context.data.ringsInstances[i].color),
            //emissive: hexToRgba(context.data.ringsInstances[i].emissive),
            //specular: hexToRgba(context.data.ringsInstances[i].specular),
            transparent: true,
            opacity: context.data.ringsInstances[i].ringOpacity,
            flatShading: false
        });

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        mesh.rotation.x = degreesToRadians(90);
        mesh.rotation.z = degreesToRadians(context.data.ringsInstances[i].initialRotation);

        const theRotateGaston = findOneWayValue(0, 180 * context.data.ringsInstances[i].times, context.numberOfFrames, context.currentFrame);

        if ((i + 1) % 2 === 0) {
            mesh.rotation.z += degreesToRadians(theRotateGaston);
        } else {
            mesh.rotation.z -= degreesToRadians(theRotateGaston);
        }

    }

    camera.position.z = 400;
    camera.lookAt(0, 0, 0);

    const light1 = new THREE.SpotLight(hexToRgba(context.data.light1), 50, 600);
    light1.position.set(0, 0, 250);
    light1.target = center;
    scene.add(light1);

    const light2 = new THREE.SpotLight(hexToRgba(context.data.light2), 50, 600);
    light2.position.set(0, 0, 250);
    light2.target = center;
    scene.add(light2);

    const light3 = new THREE.SpotLight(hexToRgba(context.data.light2), 50, 600);
    light3.position.set(0, 0, 250);
    light3.target = center;
    scene.add(light3);


    renderer.render(scene, camera);

    canvas.toFile(filename);
}


export const threeDimensionalRings = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        data: data,
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: GlobalSettings.getWorkingDirectory() + 'three-dimensional-rings' + randomId() + '.png'
    }

    await draw(context, context.drawing)

    await layer.fromFile(context.drawing);

    fs.unlinkSync(context.drawing);
}
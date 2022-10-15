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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);

    const canvas = new Canvas3d(width, height);

    const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true
    });

    for (let i = 0; i < context.data.rings; i++) {

        const innerRadius = context.data.radiusConstant + (context.data.ringGap * (i + 1))

        const geometry = new THREE.CylinderGeometry(innerRadius, innerRadius, context.data.ringsInstances[i].height, 64, 1, true);

        const material = new THREE.MeshPhongMaterial({
            color: hexToRgba(context.data.ringsInstances[i].color),
            //emissive: hexToRgba(context.data.ringsInstances[i].emissive),
            //specular: hexToRgba(context.data.ringsInstances[i].specular),
            transparent: true,
            opacity: 0.55,
            shininess: 50,
            flatShading: false
        });

        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        mesh.rotation.x = degreesToRadians(90);
        mesh.rotation.z = degreesToRadians(context.data.ringsInstances[i].initialRotation);

        const light = new THREE.AmbientLight(hexToRgba(context.data.light), 100);
        light.position.set(0, 0, 0);
        scene.add(light);


        camera.position.z = 400;

        const theRotateGaston = findOneWayValue(0, 180 * context.data.ringsInstances[i].times, context.numberOfFrames, context.currentFrame);

        if ((i + 1) % 2 === 0) {
            mesh.rotation.z += degreesToRadians(theRotateGaston);
        } else {
            mesh.rotation.z -= degreesToRadians(theRotateGaston);
        }

    }

    renderer.render(scene, camera);

    canvas.toFile(filename);
}


export const threeDimensionalRings = async (layer, data, currentFrame, numberOfFrames) => {

    const context = {
        data: data,
        currentFrame: currentFrame,
        numberOfFrames: numberOfFrames,
        drawing: getWorkingDirectory() + 'three-dimensional-rings' + randomId() + '.png'
    }

    await draw(context, context.drawing)

    await layer.fromFile(context.drawing);

    fs.unlinkSync(context.drawing);
}
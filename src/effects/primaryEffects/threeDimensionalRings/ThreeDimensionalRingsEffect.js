import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import * as THREE from "three";
import {Canvas3d} from "../../../core/factory/canvas/Canvas3d.js";
import {hexToRgba} from "../../../core/utils/hexToRgba.js";
import {degreesToRadians} from "../../../core/math/drawingMath.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import { promises as fs } from 'fs'
import {Settings} from "../../../core/Settings.js";
import {ThreeDimensionalRingsConfig} from "./ThreeDimensionalRingsConfig.js";

export class ThreeDimensionalRingsEffect extends LayerEffect {

    static _name_ = 'three-dimensional-rings';

    constructor({
                    name = ThreeDimensionalRingsEffect._name_,
                    requiresLayer = true,
                    config = new ThreeDimensionalRingsConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }


    async #draw(context, filename) {
        const finalImageSize = this.finalSize;

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


    async #threeDimensionalRings(layer, currentFrame, numberOfFrames) {

        const context = {
            data: this.data,
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            drawing: this.workingDirectory + 'three-dimensional-rings' + randomId() + '.png'
        }

        await this.#draw(context, context.drawing)

        await layer.fromFile(context.drawing);

        await fs.unlink(context.drawing);
    }

    #generate(settings) {
        const data = {
            radiusConstant: this.config.radiusConstant,
            ringGap: randomNumber(this.config.ringGap.lower, this.config.ringGap.upper),
            rings: getRandomIntInclusive(this.config.rings.lower, this.config.rings.upper),
            ringRadius: randomNumber(this.config.ringRadius.lower, this.config.ringRadius.upper),
            light1: settings.getLightFromBucket(),
            light2: settings.getLightFromBucket(),
            light3: settings.getLightFromBucket(),
        }

        const computeInitialInfo = (rings) => {
            const info = [];
            const color = settings.getColorFromBucket();
            for (let i = 0; i <= rings; i++) {
                info.push({
                    times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
                    height: getRandomIntInclusive(this.config.height.lower, this.config.height.upper),
                    ringOpacity: randomNumber(this.config.ringOpacity.lower, this.config.ringOpacity.upper),
                    initialRotation: getRandomIntInclusive(0, 360),
                    color: color,
                    emissive: color,
                    specular: color,
                });
            }
            return info;
        }

        data.ringsInstances = computeInitialInfo(data.rings);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#threeDimensionalRings(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.rings} rings`
    }
}





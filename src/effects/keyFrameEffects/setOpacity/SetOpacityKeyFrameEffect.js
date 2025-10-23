import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {promises as fs} from "fs";
import {findValue} from "my-nft-gen/src/core/math/findValue.js";
import Jimp from "jimp";
import {SetOpacityKeyFrameConfig} from "./SetOpacityKeyFrameConfig.js";
import {FadeConfig} from "../../secondaryEffects/fade/FadeConfig.js";

/** *
 *
 * Pixelate Effect
 * Creates an animated glitch for the composite image
 * Can be glitched to appear on a percentage of the frames generated
 * Instantiated through the project via the LayerConfig
 *
 */

export class SetOpacityKeyFrameEffect extends LayerEffect {
    static _name_ = 'set-opacity-event';

    static presets = [
        {
            name: 'high-opacity-event',
            effect: 'set-opacity-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 180, 540],
                glitchFrameCount: [15, 30],
                opacity: 0.9,
            }
        },
        {
            name: 'medium-opacity-event',
            effect: 'set-opacity-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 120, 360, 900],
                glitchFrameCount: [15, 30],
                opacity: 0.7,
            }
        },
        {
            name: 'low-opacity-event',
            effect: 'set-opacity-event',
            percentChance: 100,
            currentEffectConfig: {
                keyFrames: [0, 60, 180, 360, 720],
                glitchFrameCount: [15, 30],
                opacity: 0.4,
            }
        }
    ];

    constructor({
                    name = SetOpacityKeyFrameEffect._name_,
                    requiresLayer = true,
                    config = new SetOpacityKeyFrameConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
    }

    #generate(settings) {
        const data = {
            keyFrames: this.config.keyFrames,
            opacity: this.config.opacity,
        };

        const createKeyFrameValues = (data) => {

            const keyFrameValues = [];

            for (let index = 0; index < data.keyFrames.length; index++) {
                const keyFrameValue = {
                    glitchFrameCount: getRandomFromArray(this.config.glitchFrameCount),
                }

                keyFrameValues.push(keyFrameValue);
            }

            return keyFrameValues;
        }

        data.keyFrameValues = createKeyFrameValues(data);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await layer.adjustLayerOpacity(this.data.opacity);
    }

    getInfo() {
        return `${this.name}: ${this.data.keyFrames.join(', ')} keyframe(s) set opacity to ${this.data.lower.toFixed(3)}`;
    }
}

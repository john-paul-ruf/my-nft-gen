import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {CRTBarrelConfig} from "./CRTBarrelConfig.js";
import {globalBufferPool} from 'my-nft-gen/src/core/pool/BufferPool.js';

/** *
 *
 * CRT Barrel Effect
 * Creates barrel distortion like old CRT monitors
 * Instantiated through the project via the LayerConfig
 *
 */

export class CRTBarrelEffect extends LayerEffect {
    static _name_ = 'crt-barrel';

    static presets = [
        {
            name: 'subtle-barrel',
            effect: 'crt-barrel',
            percentChance: 100,
            currentEffectConfig: {
                strength: {lower: 0.2, upper: 0.3},
                edgeThreshold: {lower: 0.05, upper: 0.1},
                corner: {lower: 0.05, upper: 0.1}
            }
        },
        {
            name: 'classic-barrel',
            effect: 'crt-barrel',
            percentChance: 100,
            currentEffectConfig: {
                strength: {lower: 0.5, upper: 0.5},
                edgeThreshold: {lower: 0.1, upper: 0.1},
                corner: {lower: 0.1, upper: 0.1}
            }
        },
        {
            name: 'extreme-barrel',
            effect: 'crt-barrel',
            percentChance: 100,
            currentEffectConfig: {
                strength: {lower: 0.8, upper: 1.0},
                edgeThreshold: {lower: 0.15, upper: 0.2},
                corner: {lower: 0.15, upper: 0.2}
            }
        }
    ];

    constructor({
                    name = CRTBarrelEffect._name_,
                    requiresLayer = true,
                    config = new CRTBarrelConfig({}),
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


    async #applyBarrelDistortion(filename, filenameOut, strength = 0.5, edgeThreshold = 0.1, corner = 0.1) {
        const image = sharp(filename);

        const {data, info} = await image.raw().toBuffer({resolveWithObject: true});
        const {width, height, channels} = info;

        const warpedBuffer = globalBufferPool.getBuffer(width, height, channels);

        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate the pixel threshold for edge effects
        const pixelThreshold = Math.min(width, height) * edgeThreshold;
        const cornerRadius = Math.min(width, height) * corner;  // Set radius for rounded corners

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const distX = Math.min(x, width - x - 1);
                const distY = Math.min(y, height - y - 1);
                const distToCenterX = x - centerX;
                const distToCenterY = y - centerY;
                const distToEdge = Math.min(distX, distY);
                const distanceFromCorner = Math.sqrt(distToCenterX ** 2 + distToCenterY ** 2);

                // Start with a base warp factor
                let warpFactor = 1;

                // Apply edge warp factor based on proximity to edges
                if (distToEdge < pixelThreshold) {
                    warpFactor = 1 + strength * (1 - Math.sin((Math.PI / 2) * (distToEdge / pixelThreshold)));
                }

                // Further refine the warp factor near the corners
                if (distanceFromCorner > Math.max(width, height) * 0.85) {
                    warpFactor *= 1 - 0.5 * (1 - Math.cos((Math.PI / 2) * ((distanceFromCorner / Math.max(width, height) - 0.85) / 0.15)));
                }

                // Apply additional corner logic for smoothness
                // Calculate distance to each corner
                const distTopLeft = Math.sqrt(x * x + y * y);
                const distTopRight = Math.sqrt((x - width) * (x - width) + y * y);
                const distBottomLeft = Math.sqrt(x * x + (y - height) * (y - height));
                const distBottomRight = Math.sqrt((x - width) * (x - width) + (y - height) * (y - height));

                // Modify warp factor near the rounded corners
                if (distTopLeft <= cornerRadius || distTopRight <= cornerRadius || distBottomLeft <= cornerRadius || distBottomRight <= cornerRadius) {
                    warpFactor *= 1 - (strength * (cornerRadius - Math.min(distTopLeft, distTopRight, distBottomLeft, distBottomRight)) / cornerRadius);
                }

                // Apply the calculated warp factor to determine new pixel coordinates
                const newX = Math.round(centerX + distToCenterX * warpFactor);
                const newY = Math.round(centerY + distToCenterY * warpFactor);
                const srcX = Math.min(Math.max(newX, 0), width - 1);
                const srcY = Math.min(Math.max(newY, 0), height - 1);

                const srcIdx = (srcY * width + srcX) * channels;
                const destIdx = (y * width + x) * channels;

                // Copy pixel data from the original to the warped buffer
                for (let c = 0; c < channels; c++) {
                    warpedBuffer[destIdx + c] = data[srcIdx + c];
                }
            }
        }

        // Save the modified image with the barrel distortion applied
        await sharp(warpedBuffer, {
            raw: {
                width: width,
                height: height,
                channels: 4
            }
        }).toFile(filenameOut);
        
        // Return buffer to pool
        globalBufferPool.returnBuffer(warpedBuffer, width, height, channels);
    }



    async #barrelEffect(layer, currentFrame, numberOfFrames) {

        const filename = `${this.workingDirectory}crt-barrel${randomId()}.png`;
        const filenameOut = `${this.workingDirectory}crt-barrel-out${randomId()}.png`;
        await layer.toFile(filename);

        await this.#applyBarrelDistortion(filename, filenameOut, this.data.strength, this.data.edgeThreshold, this.data.corner);

        await layer.fromFile(filenameOut);

        await fs.unlink(filename);
        await fs.unlink(filenameOut);
    }


    #generate(settings) {

        const data = {
            strength: randomNumber(this.config.strength.lower, this.config.strength.upper),
            edgeThreshold: randomNumber(this.config.edgeThreshold.lower, this.config.edgeThreshold.upper),
            corner: randomNumber(this.config.corner.lower, this.config.corner.upper),
        };

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#barrelEffect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.strength} stregth ${this.data.edgeThreshold} edge distortion ${this.data.corner} corner`;
    }
}

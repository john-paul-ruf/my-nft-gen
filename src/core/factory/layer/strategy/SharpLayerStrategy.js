import sharp from 'sharp';
import {Readable} from 'stream';
import {pipeline} from 'node:stream/promises';
import {promises as fs, createWriteStream} from 'fs';
import {mapNumberToRange} from '../../../math/mapNumberToRange.js';
import {randomId} from '../../../math/random.js';
import {globalBufferPool} from '../../../pool/BufferPool.js';

export class SharpLayerStrategy {
    constructor({
                    finalImageSize = {
                        width: 0,
                        height: 0,
                        longestSide: 0,
                        shortestSide: 0,
                    },
                    workingDirectory = null,
                }) {
        this.internalRepresentation = null;
        this.finalImageSize = finalImageSize;
        this.workingDirectory = workingDirectory;
        
        sharp.simd(true);
        sharp.concurrency(0);
    }
    
    getPngSettings(hasTransparency = true, isLineart = false) {
        return {
            compressionLevel: 1,
            quality: 100,
            palette: isLineart,
            colors: hasTransparency ? 256 : undefined,
            force: true
        };
    }
    

    async newLayer(height, width, backgroundColor) {
        this.internalRepresentation = sharp({
            create: {
                width, height, channels: 4, background: backgroundColor,
            },
        });
    }

    async fromFile(filename) {
        this.internalRepresentation = await sharp(await fs.readFile(filename));

    }

    async fromBuffer(buffer) {
        this.internalRepresentation = await sharp(buffer);
        buffer = null;
    }

    async toBuffer() {
        return await this.internalRepresentation
            .png(this.getPngSettings())
            .toBuffer({resolveWithObject: false});
    }

    async toFile(filename) {
        return this.internalRepresentation
            .png(this.getPngSettings())
            .toFile(filename);
    }

    async compositeLayerOver(layer, withoutResize = false) {
        let inputBuffer = await layer.toBuffer();
        this.internalRepresentation = this.internalRepresentation.composite([{input: inputBuffer}]);
        inputBuffer = null;
    }

    async compositeLayerOverAtPoint(layer, top, left) {
        let inputBuffer = await layer.toBuffer();
        this.internalRepresentation = this.internalRepresentation.composite([{
            input: inputBuffer,
            top: Math.floor(top),
            left: Math.floor(left),
        }]);
        inputBuffer = null;
    }

    async adjustLayerOpacity(opacity) {
        const newOpacity = mapNumberToRange(opacity, 0, 1, 0, 255);
        const info = await this.getInfo();
        const alphaBuffer = globalBufferPool.getBuffer(info.width, info.height, 4);
        alphaBuffer.fill(newOpacity);
        
        this.internalRepresentation = this.internalRepresentation.composite([{
            input: alphaBuffer,
            raw: {
                width: info.width, height: info.height, channels: 4,
            },
            blend: 'dest-in',
        }]);
        
        globalBufferPool.returnBuffer(alphaBuffer, info.width, info.height, 4);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            this.internalRepresentation = this.internalRepresentation.blur(byPixels);
        }
    }

    async rotate(angle) {
        const info = await this.getInfo();
        this.internalRepresentation = this.internalRepresentation
            .rotate(angle, {background: {r: 0, g: 0, b: 0, alpha: 0}})
            .resize(info.width, info.height, {
                kernel: sharp.kernel.nearest,
                fit: 'contain',
                background: {r: 0, g: 0, b: 0, alpha: 0}
            });
    }

    async resize(height, width, fitType) {
        this.internalRepresentation = this.internalRepresentation.resize(width, height, {
            kernel: sharp.kernel.nearest,
            fit: fitType,
            position: 'center',
            background: {r: 0, g: 0, b: 0, alpha: 0}
        });
    }

    async crop(left, top, width, height) {
        try {
            this.internalRepresentation = this.internalRepresentation.extract({
                left, top, width, height,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async extend(top, bottom, left, right) {
        try {
            this.internalRepresentation = this.internalRepresentation.extend({
                top, bottom, left, right,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            });
        } catch (e) {
            console.log(e);
        }
    }

    async getInfo() {
        let result = await this.internalRepresentation.png({
            compressionLevel: 1, quality: 100, force: true,
        }).toBuffer({resolveWithObject: true});

        result.data = null;

        return result.info;
    }

    async modulate({brightness, saturation, contrast}) {
        let result = await this.internalRepresentation.modulate({
            brightness: brightness, // Keep brightness unchanged
            saturation: saturation, // Keep saturation unchanged
            contrast: contrast  // Increase contrast by 50%
        }).toBuffer({resolveWithObject: true});

        result.data = null;

        return result.info;
    }
}

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
    }

    async newLayer(height, width, backgroundColor) {
        this.internalRepresentation = sharp({
            create: {
                width, height, channels: 4, background: backgroundColor,
            },
        });

        const filename = `${this.workingDirectory}blank-layer${randomId()}.png`;
        await this.toFile(filename);
        await this.fromFile(filename);
        await fs.unlink(filename);
    }

    async fromFile(filename) {
        this.internalRepresentation = await sharp(await fs.readFile(filename));

    }

    async fromBuffer(buffer) {
        this.internalRepresentation = await sharp(buffer);
        buffer = null;
    }

    async toBuffer() {
        return await this.internalRepresentation.png({
            compressionLevel: 1, force: true,
        }).toBuffer({resolveWithObject: false});
    }

    async toFile(filename) {
        let buffer = await this.internalRepresentation.png({
            compressionLevel: 1, force: true,
        }).toBuffer({resolveWithObject: false});

        const readableStream = Readable.from(buffer);
        const writableStream = createWriteStream(filename);

        await pipeline(readableStream, writableStream);
        buffer = null;
    }

    async compositeLayerOver(layer, withoutResize = false) {
        const {finalImageSize} = this;

        const currentInfo = await this.getInfo();
        const layerInfo = await layer.getInfo();

        if (!withoutResize) {
            if (currentInfo.height > finalImageSize.height
                || currentInfo.width > finalImageSize.width) {
                await this.resize(finalImageSize.height, finalImageSize.width, 'contain');
            }

            if (layerInfo.height > finalImageSize.height
                || layerInfo.width > finalImageSize.width) {
                await layer.resize(finalImageSize.height, finalImageSize.width, 'contain');
            }
        }

        let inputBuffer = await layer.toBuffer();

        await this.fromBuffer(await sharp(await this.toBuffer()).png({
            compressionLevel: 1, force: true,
        }).composite([{
            input: inputBuffer,
        }]).png({compressionLevel: 1, force: true})
            .toBuffer());

        inputBuffer = null;
    }

    async compositeLayerOverAtPoint(layer, top, left) {
        const {finalImageSize} = this;

        let inputBuffer = await layer.toBuffer();

        await this.fromBuffer(await sharp(await this.toBuffer()).png({
            compressionLevel: 1, force: true,
        }).composite([{
            input: inputBuffer,
            top:  Math.floor(top),
            left: Math.floor(left),
        }]).png({compressionLevel: 1, force: true})
            .toBuffer());

        inputBuffer = null;
    }

    async adjustLayerOpacity(opacity) {
        const newOpacity = mapNumberToRange(opacity, 0, 1, 0, 255);

        const info = await this.getInfo();
        const alphaBuffer = globalBufferPool.getBuffer(info.width, info.height, 4);
        alphaBuffer.fill(newOpacity);

        let buffer = await sharp(await this.toBuffer()).png({
            compressionLevel: 1, force: true,
        }).composite([{
            input: alphaBuffer,
            raw: {
                width: info.width, height: info.height, channels: 4,
            },
            blend: 'dest-in',
        }]).png({
            compressionLevel: 1, force: true,
        })
            .toBuffer({resolveWithObject: false});

        await this.fromBuffer(buffer);

        globalBufferPool.returnBuffer(alphaBuffer, info.width, info.height, 4);
        buffer = null;
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await this.internalRepresentation.blur(byPixels);
        }
    }

    async rotate(angle) {
        const info = await this.getInfo();
        await this.fromBuffer(await this.internalRepresentation.rotate(angle,
            {
                background: {r: 0, g: 0, b: 0, alpha: 0}
            })
            .resize(info.width, info.height, {fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}})
            .png({compressionLevel: 1, force: true})
            .toBuffer());
    }

    async resize(height, width, fitType) {
        await this.fromBuffer(await this.internalRepresentation.resize(width, height, {
            kernel: sharp.kernel.nearest,
            fit: fitType,
            position: 'center',
            background: {r: 0, g: 0, b: 0, alpha: 0}
        }).png({compressionLevel: 1, force: true})
            .toBuffer());
    }

    async crop(left, top, width, height) {
        try {
            await this.fromBuffer(await this.internalRepresentation.extract({
                left, top, width, height,
            }).png({compressionLevel: 1, force: true})
                .toBuffer());
        } catch (e) {
            console.log(e);
        }
    }

    async extend(top, bottom, left, right) {
        try {
            await this.fromBuffer(await this.internalRepresentation.extend({
                top, bottom, left, right,
                background: {r: 0, g: 0, b: 0, alpha: 0}
            }).png({compressionLevel: 1, force: true})
                .toBuffer());
        } catch (e) {
            console.log(e);
        }
    }

    async getInfo() {
        let result = await this.internalRepresentation.png({
            compressionLevel: 1, force: true,
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


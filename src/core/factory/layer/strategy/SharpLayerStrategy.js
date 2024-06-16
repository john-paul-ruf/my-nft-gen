import sharp from 'sharp';
import {Readable} from 'stream';
import {pipeline} from 'node:stream/promises';
import {promises as fs, createWriteStream} from 'fs';
import {promisify} from 'util';
import {mapNumberToRange} from '../../../math/mapNumberToRange.js';
import {randomId} from '../../../math/random.js';
import {Layer} from '../Layer.js';
import {LayerFactory} from '../LayerFactory.js';

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
        this.fileBuffer = null;
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
        this.fileBuffer = await fs.readFile(filename);
        this.internalRepresentation = await sharp(this.fileBuffer);
    }

    async fromBuffer(buffer) {
        this.internalRepresentation = await sharp(buffer);
    }

    async toBuffer() {
        return await this.internalRepresentation.png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: false});
    }

    async toFile(filename) {
        const buffer = await this.internalRepresentation.png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: false});

        const readableStream = Readable.from(buffer);
        const writableStream = createWriteStream(filename);

        await pipeline(readableStream, writableStream);
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

        const inputBuffer = await layer.toBuffer();

        await this.fromBuffer(await sharp(await this.toBuffer()).png({
            compressionLevel: 0, force: true,
        }).composite([{
            input: inputBuffer,
        }]).png({compressionLevel: 0, force: true})
            .toBuffer());
    }

    async adjustLayerOpacity(opacity) {
        const newOpacity = mapNumberToRange(opacity, 0, 1, 0, 255);

        const info = await this.getInfo();
        const buffer = await sharp(await this.toBuffer()).png({
            compressionLevel: 0, force: true,
        }).composite([{
            input: Buffer.alloc(info.width * info.height * 4, newOpacity),
            raw: {
                width: info.width, height: info.height, channels: 4,
            },
            blend: 'dest-in',
        }]).png({
            compressionLevel: 0, force: true,
        })
            .toBuffer({resolveWithObject: false});

        await this.fromBuffer(buffer);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await this.internalRepresentation.blur(byPixels);
        }
    }

    async rotate(angle) {
        await this.fromBuffer(await this.internalRepresentation.rotate(angle,
            {
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }).png({compressionLevel: 0, force: true})
            .toBuffer());
    }

    async resize(height, width, fitType) {
        await this.fromBuffer(await this.internalRepresentation.resize(width, height, {
            kernel: sharp.kernel.nearest,
            fit: fitType,
            position: 'center',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }).png({compressionLevel: 0, force: true})
            .toBuffer());
    }

    async crop(left, top, width, height) {
        await this.fromBuffer(await this.internalRepresentation.extract({
            left, top, width, height,
        }).png({compressionLevel: 0, force: true})
            .toBuffer());
    }

    async getInfo() {
        const {info} = await this.internalRepresentation.png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: true});

        return info;
    }
}

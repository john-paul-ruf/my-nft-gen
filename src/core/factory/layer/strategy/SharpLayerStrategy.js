import sharp from "sharp";
import {randomId} from "../../../math/random.js";
import fs from "fs";
import {mapNumberToRange} from "../../../math/mapNumberToRange.js";

export class SharpLayerStrategy {
    constructor({
                    finalImageSize = {
                        width: 0,
                        height: 0,
                        longestSide: 0,
                        shortestSide: 0
                    },
                    workingDirectory = null
                }) {
        this.internalRepresentation = null;
        this.fileBuffer = null;
        this.finalImageSize = finalImageSize;
        this.workingDirectory = workingDirectory;
    }

    async newLayer(height, width, backgroundColor) {
        this.internalRepresentation = sharp({
            create: {
                width: width, height: height, channels: 4, background: backgroundColor,
            }
        })

        const filename = this.workingDirectory + 'blank-layer' + randomId() + '.png'
        await this.toFile(filename)
        await this.fromFile(filename)
        fs.unlinkSync(filename);
    }

    async fromFile(filename) {
        this.fileBuffer = fs.readFileSync(filename);
        this.internalRepresentation = sharp(this.fileBuffer);
    }

    async toFile(filename) {
        const buffer = await this.internalRepresentation.png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: true})
        fs.writeFileSync(filename, Buffer.from(buffer.data));
    }

    async compositeLayerOver(layer, withResize = true) {

        const finalImageSize = this.finalImageSize;

        const overlayFile = this.workingDirectory + 'overlay' + randomId() + '.png';
        const targetFile = this.workingDirectory + 'target' + randomId() + '.png';
        const compositeFile = this.workingDirectory + 'composite' + randomId() + '.png';

        if (withResize) {
            await layer.resize(finalImageSize.height, finalImageSize.width);
        }

        await layer.toFile(overlayFile)
        await this.toFile(targetFile);

        const buffer = await sharp(targetFile).composite([{
            input: overlayFile
        }]).png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: true});

        fs.writeFileSync(compositeFile, Buffer.from(buffer.data));

        await this.fromFile(compositeFile);

        fs.unlinkSync(overlayFile);
        fs.unlinkSync(targetFile);
        fs.unlinkSync(compositeFile);
    }

    async adjustLayerOpacity(opacity) {
        const newOpacity = mapNumberToRange(opacity, 0, 1, 0, 255);
        const meta = await this.getInfo();

        const targetFile = this.workingDirectory + 'target' + randomId() + '.png';
        const compositeFile = this.workingDirectory + 'composite' + randomId() + '.png';

        await this.toFile(targetFile);

        const buffer = await sharp(targetFile).composite([{
            input: Buffer.alloc(meta.width * meta.height * 4, newOpacity), raw: {
                width: meta.width, height: meta.height, channels: 4
            }, blend: 'dest-in'
        }]).png({
            compressionLevel: 0, force: true,
        }).toBuffer({resolveWithObject: true});

        fs.writeFileSync(compositeFile, Buffer.from(buffer.data));

        await this.fromFile(compositeFile);

        fs.unlinkSync(targetFile);
        fs.unlinkSync(compositeFile);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await this.internalRepresentation.blur(byPixels)
        }
    }

    async rotate(angle) {
        await this.internalRepresentation.rotate(angle);
    }

    async resize(height, width) {
        await this.internalRepresentation.resize(width, height, {
            kernel: sharp.kernel.nearest,
            fit: 'inside',
            position: 'center',
        });
    }

    async crop(left, top, width, height) {
        await this.internalRepresentation.extract({
            left: left, top: top, width: width, height: height
        }).resize(width, height);
    }

    async getInfo() {
        return await this.internalRepresentation.metadata()
    }
}
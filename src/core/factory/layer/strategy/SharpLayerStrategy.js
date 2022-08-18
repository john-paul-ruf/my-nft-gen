import sharp from "sharp";
import {getFinalImageSize, getWorkingDirectory} from "../../../GlobalSettings.js";
import {randomId} from "../../../math/random.js";
import fs from "fs";

export class SharpLayerStrategy {
    constructor() {
        this.internalRepresentation = null;
        this.fileBuffer = null;
    }

    async newLayer(height, width, backgroundColor) {
        this.internalRepresentation = sharp({
            create: {
                width: width, height: height, channels: 4, background: backgroundColor,
            }
        })

        const filename = getWorkingDirectory() + 'blank-layer' + randomId() + '.png'
        await this.toFile(filename)
        await this.fromFile(filename)
        fs.unlinkSync(filename);
    }

    async fromFile(filename) {
        this.fileBuffer = fs.readFileSync(filename);
        this.internalRepresentation = sharp(this.fileBuffer);
    }

    async toFile(filename) {
        const buffer = await this.internalRepresentation.png({palette: true}).toBuffer({resolveWithObject: true})
        fs.writeFileSync(filename, Buffer.from(buffer.data));
    }

    async compositeLayerOver(layer) {

        const finalImageSize = getFinalImageSize();

        const overlayFile = getWorkingDirectory() + 'overlay' + randomId() + '.png';
        const targetFile = getWorkingDirectory() + 'target' + randomId() + '.png';
        const compositeFile = getWorkingDirectory() + 'composite' + randomId() + '.png';

        await layer.resize(finalImageSize.height, finalImageSize.width);

        await layer.toFile(overlayFile)
        await this.toFile(targetFile);

        const buffer = await sharp(targetFile).composite([{
            input: overlayFile,
            blend: 'over'
        }]).png({palette: true}).toBuffer({resolveWithObject: true});

        fs.writeFileSync(compositeFile, Buffer.from(buffer.data));

        await this.fromFile(compositeFile);
        this.internalRepresentation.ensureAlpha();

        fs.unlinkSync(overlayFile);
        fs.unlinkSync(targetFile);
        fs.unlinkSync(compositeFile);
    }

    async adjustLayerOpacity(opacity) {
        this.internalRepresentation.removeAlpha();
        this.internalRepresentation.ensureAlpha(opacity);
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
        const imageMetaData = await this.internalRepresentation.metadata();

        const top = Math.ceil((imageMetaData.height - height) / 2);
        const left = Math.ceil((imageMetaData.width - width) / 2);

        await this.internalRepresentation.extract({
            left: left, top: top, width: width, height: height
        }).resize(width, height);
    }
}
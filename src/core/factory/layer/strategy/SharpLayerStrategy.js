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
        const buffer = await this.internalRepresentation.png().toBuffer({resolveWithObject: true})
        fs.writeFileSync(filename, Buffer.from(buffer.data));
    }

    async compositeLayerOver(layer) {

        const finalImageSize = getFinalImageSize();

        const overlayFile = getWorkingDirectory() + 'overlay' + randomId() + '.png';

        await layer.resize(finalImageSize.height, finalImageSize.width);

        await layer.toFile(overlayFile)

        const fileBuffer = fs.readFileSync(overlayFile);

        await this.internalRepresentation.composite([{input: fileBuffer}]);

        await this.toFile(overlayFile);
        await this.fromFile(overlayFile);

        fs.unlinkSync(overlayFile);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await this.internalRepresentation.blur(byPixels)
        }
    }

    async rotate(angle) {
        const overlayFile = getWorkingDirectory() + 'rotate' + randomId() + '.png';
        await this.internalRepresentation.rotate(angle);
        await this.toFile(overlayFile);
        this.internalRepresentation = null;
        await this.fromFile(overlayFile);
        fs.unlinkSync(overlayFile);
    }

    async resize(height, width) {

        const imageMetaData = await this.internalRepresentation.metadata();

        const top = Math.ceil((imageMetaData.height - height) / 2);
        const left = Math.ceil((imageMetaData.width - width) / 2);

        await this.internalRepresentation.extract({
            left: left,
            top: top,
            width: width,
            height: height
        }).resize(width, height);
    }
}
import Jimp from "jimp";
import {getWorkingDirectory} from "../../../GlobalSettings.js";
import {randomId} from "../../../math/random.js";
import fs from "fs";

export class JimpLayerStrategy {
    constructor() {
        this.internalRepresentation = null;
    }

    async newLayer(height, width, backgroundColor) {
        this.internalRepresentation = new Jimp(width, height, Jimp.cssColorToHex(backgroundColor))
    }

    async fromFile(filename) {
        this.internalRepresentation = await Jimp.read(filename);
    }

    async toFile(filename) {
        await this.internalRepresentation.writeAsync(filename)
    }

    async compositeLayerOver(layer) {
        const overlayFile = getWorkingDirectory() + 'overlay' + randomId() + '.png';
        await layer.toFile(overlayFile)

        const overlay = await Jimp.read(overlayFile);

        const top = Math.ceil((overlay.bitmap.height - this.internalRepresentation.bitmap.height) / 2);
        const left = Math.ceil((overlay.bitmap.width - this.internalRepresentation.bitmap.width) / 2);

        this.internalRepresentation.composite(overlay, top, left, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });

        fs.unlinkSync(overlayFile);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await this.internalRepresentation.blur(byPixels)
        }
    }

    async rotate(angle) {
        await this.internalRepresentation.rotate(angle, false);
    }

    async resize(height, width) {
        await this.internalRepresentation.resize(width, height);
    }
}
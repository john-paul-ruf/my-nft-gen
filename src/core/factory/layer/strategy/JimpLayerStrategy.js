import Jimp from "jimp";
import {randomId} from "../../../math/random.js";
import fs from "fs";
import {Settings as GlobalSettings} from "../../../Settings.js";

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

    async compositeLayerOver(layer, withResize = true) {
        const info = await layer.getInfo();
        const finalImageSize = GlobalGlobalSettings.getFinalImageSize();

        const top = Math.ceil((info.height - this.internalRepresentation.bitmap.height) / 2);
        const left = Math.ceil((info.width - this.internalRepresentation.bitmap.width) / 2);

        if (info.height > finalImageSize.height && info.width > finalImageSize.width) {
            layer.crop(left, top, this.internalRepresentation.bitmap.width, this.internalRepresentation.bitmap.height);
        }

        layer.resize(finalImageSize.height, finalImageSize.width);

        const overlayFile = GlobalSettings.getWorkingDirectory() + 'overlay' + randomId() + '.png';
        await layer.toFile(overlayFile)

        const overlay = await Jimp.read(overlayFile);
        this.internalRepresentation.composite(overlay, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });

        fs.unlinkSync(overlayFile);
    }

    async adjustLayerOpacity(opacity) {
        await this.internalRepresentation.opacity(opacity);
    }

    async blur(byPixels) {
        if (byPixels > 0) {
            await new Promise((resolve, reject) => {
                this.internalRepresentation.blur(byPixels, function (err) {
                    if (err) {
                        console.log(err);
                        reject()
                    }
                    resolve();
                })
            })
        }
    }

    async rotate(angle) {
        await this.internalRepresentation.rotate(angle, false);
    }

    async resize(height, width) {
        const info = await this.getInfo();

        //https://stackoverflow.com/a/74196265
        const isHorizontal = info.width > info.height;
        const ratio = isHorizontal
            ? info.width / info.height
            : info.height / info.width;
        const twidth = width; // TODO: Do I need to factor in shortest or longest side here
        const theight = isHorizontal ? width / ratio : width * ratio;


        await this.internalRepresentation.resize(twidth, theight);

        const top = Math.ceil((theight - height) / 2);
        const left = Math.ceil((twidth - width) / 2);

        await this.crop(left, top, width, height);
    }

    async crop(left, top, width, height) {
        await new Promise((resolve, reject) => {
            this.internalRepresentation.crop(left, top, width, height, function (err) {
                if (err) {
                    console.log(err);
                    reject()
                }
                resolve();
            })
        })
    }

    async getInfo() {
        return new Promise((resolve) => {
            resolve({
                height: this.internalRepresentation.bitmap.height, width: this.internalRepresentation.bitmap.width,
            });
        });
    }
}
import Jimp from "jimp";
import {randomId} from "../logic/math/random.js";
import fs from "fs";
import sharp from "sharp";
import {getFinalImageSize, getLayerStrategy, getWorkingDirectory} from "../logic/core/gobals.js";

class SharpLayerStrategy {
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
        await this.internalRepresentation.blur(byPixels)
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

class JimpLayerStrategy {
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
        await this.internalRepresentation.blur(byPixels)
    }

    async rotate(angle) {
        await this.internalRepresentation.rotate(angle, false);
    }

    async resize(height, width) {
        await this.internalRepresentation.resize(width, height);
    }
}

class Layer {
    constructor(strategy) {
        this.strategy = strategy
    }

    async newLayer(height, width, backgroundColor) {
        await this.strategy.newLayer(height, width, backgroundColor);
    }

    async fromFile(filename) {
        await this.strategy.fromFile(filename)
    }

    async toFile(filename) {
        await this.strategy.toFile(filename)
    }

    async compositeLayerOver(layer) {
        await this.strategy.compositeLayerOver(layer)
    }

    async blur(byPixels) {
        await this.strategy.blur(byPixels)
    }

    async adjustLayerOpacity(opacity) {
        const fileName = getWorkingDirectory() + 'opacity' + randomId() + '.png'
        await this.toFile(fileName)

        const opacityJimpImage = await Jimp.read(fileName);
        await opacityJimpImage.opacity(opacity);

        await opacityJimpImage.writeAsync(fileName);

        await this.fromFile(fileName);

        fs.unlinkSync(fileName)
    }

    async rotate(angle) {
        await this.strategy.rotate(angle);
    }

    async resize(height, width) {
        await this.strategy.resize(height, width);
    }
}

export class LayerFactory {
    constructor() {
    }

    static getNewLayer = async (height, width, backgroundColor) => {
        switch (getLayerStrategy()) {
            case 'jimp':
                const jimpLayer = new Layer(new JimpLayerStrategy())
                await jimpLayer.newLayer(height, width, backgroundColor);
                return jimpLayer;
            case 'sharp':
                const sharpLayer = new Layer(new SharpLayerStrategy())
                await sharpLayer.newLayer(height, width, backgroundColor);
                return sharpLayer;
            default:
                throw 'Not a valid layer strategy';
        }
    }

    static getLayerFromFile = async filename => {
        switch (getLayerStrategy()) {
            case 'jimp':
                const jimpLayer = new Layer(new JimpLayerStrategy())
                await jimpLayer.fromFile(filename);
                return jimpLayer;
            case 'sharp':
                const sharpLayer = new Layer(new SharpLayerStrategy())
                await sharpLayer.fromFile(filename);
                return sharpLayer;
            default:
                throw 'Not a valid layer strategy';
        }
    }
}

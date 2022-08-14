import {getWorkingDirectory} from "../../GlobalSettings.js";
import {randomId} from "../../math/random.js";
import Jimp from "jimp";
import fs from "fs";

export class Layer {
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
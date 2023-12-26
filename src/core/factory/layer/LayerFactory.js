import {JimpLayerStrategy} from "./strategy/JimpLayerStrategy.js";
import {SharpLayerStrategy} from "./strategy/SharpLayerStrategy.js";
import {Layer} from "./Layer.js";
import {GlobalSettings} from "../../GlobalSettings.js";


export class LayerFactory {
    constructor() {
    }

    static getNewLayer = async (height, width, backgroundColor) => {
        switch (GlobalSettings.getLayerStrategy()) {
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
        switch (GlobalSettings.getLayerStrategy()) {
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

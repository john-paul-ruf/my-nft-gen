import { SharpLayerStrategy } from './strategy/SharpLayerStrategy.js';
import { Layer } from './Layer.js';

export class LayerFactory {
    constructor() {
    }

    static getNewLayer = async (
        height,
        width,
        backgroundColor,
        config = {
            finalImageSize: {
                width: 0,
                height: 0,
                longestSide: 0,
                shortestSide: 0,
            },
            workingDirectory: null,
            layerStrategy: 'sharp',
        },
    ) => {
        switch (config.layerStrategy) {
        case 'sharp':
            const sharpLayer = new Layer(new SharpLayerStrategy(config));
            await sharpLayer.newLayer(height, width, backgroundColor);
            return sharpLayer;
        default:
            throw 'Not a valid layer strategy';
        }
    };

    static getLayerFromFile = async (filename, config = {
        finalImageSize: {
            width: 0,
            height: 0,
            longestSide: 0,
            shortestSide: 0,
        },
        workingDirectory: null,
        layerStrategy: 'sharp',
    }) => {
        switch (config.layerStrategy) {
        case 'sharp':
            const sharpLayer = new Layer(new SharpLayerStrategy(config));
            await sharpLayer.fromFile(filename);
            return sharpLayer;
        default:
            throw 'Not a valid layer strategy';
        }
    };

    static getLayerFromBuffer = async (buffer, config = {
        finalImageSize: {
            width: 0,
            height: 0,
            longestSide: 0,
            shortestSide: 0,
        },
        workingDirectory: null,
        layerStrategy: 'sharp',
    }) => {
        switch (config.layerStrategy) {
        case 'sharp':
            const sharpLayer = new Layer(new SharpLayerStrategy(config));
            await sharpLayer.fromBuffer(buffer);
            return sharpLayer;
        default:
            throw 'Not a valid layer strategy';
        }
    };
}

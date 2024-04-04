import { NodeCanvasStrategy } from './strategy/NodeCanvasStrategy.js';
import { Canvas2d } from './Canvas2d.js';

export class Canvas2dFactory {
    static getNewCanvas = async (width, height) => {
        const canvas = new Canvas2d(new NodeCanvasStrategy());
        await canvas.newCanvas(width, height);
        return canvas;
    };
}

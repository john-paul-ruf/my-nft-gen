import { Canvas2d } from './Canvas2d.js';
import {SvgCanvasStrategy} from "./strategy/SvgCanvasStrategy.js";

export class Canvas2dFactory {
    static getNewCanvas = async (width, height, strategy = 'svg') => {
        let canvasStrategy;
        switch (strategy) {
            case 'svg':
            default:
                canvasStrategy = new SvgCanvasStrategy();
                break;
        }
        const canvas = new Canvas2d(canvasStrategy);
        await canvas.newCanvas(width, height);
        return canvas;
    };
}

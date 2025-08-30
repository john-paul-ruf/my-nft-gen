import { Canvas2d } from './Canvas2d.js';
import {ByteArrayCanvasStrategy} from "./strategy/ByteArrayCanvasStrategy.js";
import {FabricCanvasStrategy} from "./strategy/FabricCanvasStrategy.js";

export class Canvas2dFactory {
    static getNewCanvas = async (width, height) => {
        const canvas = new Canvas2d(new FabricCanvasStrategy());
        await canvas.newCanvas(width, height);
        return canvas;
    };
}

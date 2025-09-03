import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {Settings} from '../../../core/Settings.js';
import {PerlinNoiseConfig} from './PerlinNoiseConfig.js';

/**
 * PerlinNoiseEffect
 * Renders animated Perlin noise using SVG turbulence filtered and tinted by a color scheme.
 */
export class PerlinNoiseEffect extends LayerEffect {
    static _name_ = 'perlin-noise';

    constructor({
                    name = PerlinNoiseEffect._name_,
                    requiresLayer = true,
                    config = new PerlinNoiseConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                } = {}) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
    }

    #generate(settings) {
        this.data = {
            width: this.finalSize.width,
            height: this.finalSize.height,
            scale: this.config.scale,
            speed: this.config.speed,
            colorScheme: this.config.colorScheme,
            seed: Math.floor(Math.random() * 10000),
        };
    }

    async #drawNoise(context) {
        const { width, height, scale, colorScheme, seed, speed } = context.data;
        const canvas = await Canvas2dFactory.getNewCanvas(width, height);

        const baseFrequency = scale;
        const frameSeed = seed + context.currentFrame * speed;
        const [lowColor, highColor] = colorScheme;

        const parseColor = (hex) => ({
            r: parseInt(hex.slice(1,3),16) / 255,
            g: parseInt(hex.slice(3,5),16) / 255,
            b: parseInt(hex.slice(5,7),16) / 255,
        });

        const low = parseColor(lowColor);
        const high = parseColor(highColor);
        const filterId = `perlin_${Math.random().toString(36).substr(2,9)}`;

        canvas.strategy.elements.push(`<defs>
  <filter id="${filterId}">
    <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="1" seed="${frameSeed}" result="noise" />
    <feComponentTransfer in="noise" result="colorNoise">
      <feFuncR type="table" tableValues="${low.r} ${high.r}" />
      <feFuncG type="table" tableValues="${low.g} ${high.g}" />
      <feFuncB type="table" tableValues="${low.b} ${high.b}" />
    </feComponentTransfer>
  </filter>
</defs>`);
        canvas.strategy.elements.push(`<rect x="0" y="0" width="${width}" height="${height}" filter="url(#${filterId})" />`);

        const layer = await canvas.convertToLayer();
        await context.layer.compositeLayerOver(layer);
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        const context = { currentFrame, numberOfFrames, data: this.data, layer };
        await this.#drawNoise(context);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: scale ${this.data.scale}, speed ${this.data.speed}`;
    }
}

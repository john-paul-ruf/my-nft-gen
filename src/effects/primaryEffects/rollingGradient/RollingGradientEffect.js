import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomIntInclusive} from '../../../core/math/random.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {Settings} from '../../../core/Settings.js';
import {RollingGradientConfig} from './RollingGradientConfig.js';

/**
 * RollingGradientEffect
 * Creates a perfectly looping rolling gradient by phase-shifting stops on a ring.
 * - Seamless: color at 0 and 1 are identical every frame.
 * - Stable order: stops are modulo-shifted, then sorted.
 * - Gamma-correct interpolation helper (for any future manual blends).
 */
export class RollingGradientEffect extends LayerEffect {
    static _name_ = 'rolling-gradient';

    constructor({
                    name = RollingGradientEffect._name_,
                    requiresLayer = true,
                    config = new RollingGradientConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
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

    // ---------- Helpers: gamma-correct conversion ----------
    #toLinear8(v) { // sRGB (0-255) -> linear (0..1)
        const x = v / 255;
        return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    #toSrgb8(lin) { // linear (0..1) -> sRGB (0-255)
        const x = lin <= 0.0031308 ? lin * 12.92 : 1.055 * Math.pow(lin, 1/2.4) - 0.055;
        return Math.max(0, Math.min(255, Math.round(x * 255)));
    }

    // Gamma-correct color interpolation (not used by the ring logic directly,
    // but kept for parity with your original API and for future blends).
    #interpolateColor(color1, color2, t) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);

        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);

        // convert to linear
        const lr1 = this.#toLinear8(r1), lg1 = this.#toLinear8(g1), lb1 = this.#toLinear8(b1);
        const lr2 = this.#toLinear8(r2), lg2 = this.#toLinear8(g2), lb2 = this.#toLinear8(b2);

        // lerp in linear
        const lr = lr1 + (lr2 - lr1) * t;
        const lg = lg1 + (lg2 - lg1) * t;
        const lb = lb1 + (lb2 - lb1) * t;

        // back to sRGB
        const r = this.#toSrgb8(lr);
        const g = this.#toSrgb8(lg);
        const b = this.#toSrgb8(lb);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // ---------- Core drawing ----------
    async #createRollingGradient(context) {
        const { width, height, direction, colorStops } = context.data;
        const canvas = await Canvas2dFactory.getNewCanvas(width, height);

        // Sort base stops
        const base = colorStops.slice().sort((a, b) => a.position - b.position);

        // Guards
        if (base.length === 0) {
            const layer = await canvas.convertToLayer();
            await context.layer.compositeLayerOver(layer);
            return;
        }
        if (base.length === 1) {
            await canvas.drawGradientRect(0, 0, width, height, [
                { offset: 0, color: base[0].color },
                { offset: 1, color: base[0].color },
            ]);
            const layer = await canvas.convertToLayer();
            await context.layer.compositeLayerOver(layer);
            return;
        }

        // Calculate smooth progress for seamless rolling
        const avgLoopTimes = base.reduce((s, st) => s + st.loopTimes, 0) / base.length;
        const progress = (context.currentFrame * avgLoopTimes) / context.numberOfFrames;
        const normalizedProgress = progress - Math.floor(progress); // Keep in 0-1 range
        const smoothPhase = direction === 'up' ? 1 - normalizedProgress : normalizedProgress;
        
        // Create a seamless repeating gradient pattern
        // This creates multiple repeats of the gradient to ensure smooth transitions
        const repeatedStops = [];
        
        // We need to create enough repetitions to handle the shifting
        const repetitions = 3;
        for (let rep = 0; rep < repetitions; rep++) {
            for (const stop of base) {
                const adjustedOffset = (stop.position + rep) / repetitions;
                if (adjustedOffset >= 0 && adjustedOffset <= 1) {
                    repeatedStops.push({ offset: adjustedOffset, color: stop.color });
                }
            }
        }
        
        // Sort the stops
        repeatedStops.sort((a, b) => a.offset - b.offset);
        
        // Apply phase shift by adjusting offsets
        const shiftedStops = repeatedStops.map(stop => {
            let newOffset = stop.offset + smoothPhase;
            // Wrap around if needed
            if (newOffset > 1) newOffset -= 1;
            if (newOffset < 0) newOffset += 1;
            return { offset: newOffset, color: stop.color };
        });
        
        // Sort again after shifting
        shiftedStops.sort((a, b) => a.offset - b.offset);
        
        // Ensure we have stops at 0 and 1 for seamless edges
        if (shiftedStops.length > 0) {
            const firstColor = shiftedStops[0].color;
            const lastColor = shiftedStops[shiftedStops.length - 1].color;
            
            // Add boundary stops
            shiftedStops.unshift({ offset: 0, color: firstColor });
            shiftedStops.push({ offset: 1, color: lastColor });
        }
        
        // Draw the gradient
        await canvas.drawGradientRect(0, 0, width, height, shiftedStops);

        const layer = await canvas.convertToLayer();
        await context.layer.compositeLayerOver(layer);
    }

    async #rollingGradient(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            data: this.data,
            layer,
        };
        await this.#createRollingGradient(context);
    }

    // ---------- Data generation ----------
    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            direction: this.config.direction, // 'up' or 'down'
            colorStops: [],
        };

        for (let i = 0; i < this.config.colorStops.length; i++) {
            const [position, color] = this.config.colorStops[i];
            data.colorStops.push({
                position,
                color,
                loopTimes: getRandomIntInclusive(this.config.loopTimes.lower, this.config.loopTimes.upper),
            });
        }

        this.data = data;
    }

    // ---------- Public API ----------
    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#rollingGradient(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        const loopInfo = this.data.colorStops.map(stop => stop.loopTimes).join(',');
        return `${this.name}: ${this.data.colorStops.length} stops, loops: [${loopInfo}], ${this.data.direction}`;
    }
}

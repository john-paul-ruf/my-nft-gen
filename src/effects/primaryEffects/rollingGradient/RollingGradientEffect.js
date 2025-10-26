import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomIntInclusive} from 'my-nft-gen/src/core/math/random.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {RollingGradientConfig} from './RollingGradientConfig.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';

/**
 * RollingGradientEffect (Holo Foil Effect)
 * Creates a perfectly looping rolling gradient by treating the gradient as a circular pattern.
 * 
 * Key features:
 * - Seamless looping: color at position 0 matches position 1 at all times
 * - Synchronized timing: all color stops use the same loopTimes for perfect cycles
 * - Circular wrapping: gradient pattern repeats infinitely without discontinuities
 * - ColorPicker integration: supports dynamic color selection per stop
 * - Gamma-correct interpolation helper (for any future manual blends)
 */
export class RollingGradientEffect extends LayerEffect {
    static _name_ = 'rolling-gradient';
    static configClass = RollingGradientConfig;

    static presets = [
        {
            name: 'slow-rolling-gradient',
            effect: 'rolling-gradient',
            percentChance: 100,
            currentEffectConfig: {
                color1: new ColorPicker(),
                color2: new ColorPicker(),
                color3: new ColorPicker(),
                color4: null,
                color5: null,
                position1: 0,
                position2: 0.5,
                position3: 1,
                position4: null,
                position5: null,
                loopTimes: new Range(1, 2),
                direction: 'down',
                layerOpacity: 0.8,
            }
        },
        {
            name: 'classic-rolling-gradient',
            effect: 'rolling-gradient',
            percentChance: 100,
            currentEffectConfig: {
                color1: new ColorPicker(),
                color2: new ColorPicker(),
                color3: new ColorPicker(),
                color4: new ColorPicker(),
                color5: new ColorPicker(),
                position1: 0,
                position2: 0.2,
                position3: 0.4,
                position4: 0.8,
                position5: 1,
                loopTimes: new Range(1, 3),
                direction: 'down',
                layerOpacity: 1.0,
            }
        },
        {
            name: 'fast-rolling-gradient',
            effect: 'rolling-gradient',
            percentChance: 100,
            currentEffectConfig: {
                color1: new ColorPicker(),
                color2: new ColorPicker(),
                color3: new ColorPicker(),
                color4: new ColorPicker(),
                color5: new ColorPicker(),
                position1: 0,
                position2: 0.15,
                position3: 0.35,
                position4: 0.7,
                position5: 1,
                loopTimes: new Range(2, 5),
                direction: 'up',
                layerOpacity: 1.0,
            }
        }
    ];

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
        // Use the first stop's loopTimes to ensure consistent cycling
        const loopTimes = base[0].loopTimes;
        // Divide by numberOfFrames (not numberOfFrames-1) so that frame N wraps back to frame 0
        // This ensures: frame 0 = phase 0, frame N-1 = phase (N-1)/N, frame N = phase 1 = phase 0
        const progress = (context.currentFrame * loopTimes) / context.numberOfFrames;
        const normalizedProgress = progress - Math.floor(progress); // Keep in 0-1 range
        // For 'down' direction, reverse the animation by negating the progress
        // We use modulo to ensure the result stays in [0, 1) range
        let smoothPhase = direction === 'up' ? normalizedProgress : -normalizedProgress;
        // Wrap negative values: -0.5 becomes 0.5, -0.9977 becomes 0.0023
        smoothPhase = ((smoothPhase % 1) + 1) % 1;
        
        // Create a seamless repeating gradient by wrapping the pattern
        // The key insight: treat the gradient as a circular/repeating pattern
        const wrappedStops = [];
        
        // First, ensure the gradient is seamless by wrapping the first color to the end
        // This creates a true circular gradient pattern
        const seamlessBase = [...base];
        
        // Add wrapped stops: one cycle before (for smooth transitions when phase > 0.5)
        // and one cycle after (for smooth transitions when phase < 0.5)
        for (const stop of base) {
            // Previous cycle (offset - 1)
            wrappedStops.push({
                offset: stop.position - 1,
                color: stop.color
            });
            // Current cycle
            wrappedStops.push({
                offset: stop.position,
                color: stop.color
            });
            // Next cycle (offset + 1)
            wrappedStops.push({
                offset: stop.position + 1,
                color: stop.color
            });
        }
        
        // Apply phase shift to all stops
        const shiftedStops = wrappedStops.map(stop => ({
            offset: stop.offset + smoothPhase,
            color: stop.color
        }));
        
        // Filter to only include stops in the visible range [0, 1]
        let visibleStops = shiftedStops.filter(stop => 
            stop.offset >= 0 && stop.offset <= 1
        );
        
        // Sort by offset
        visibleStops.sort((a, b) => a.offset - b.offset);
        
        // Remove duplicate stops that are too close together (causes visible lines)
        // This happens when the wrapping creates multiple stops at nearly the same position
        const minDistance = 0.001; // Minimum distance between stops
        const dedupedStops = [];
        for (let i = 0; i < visibleStops.length; i++) {
            const currentStop = visibleStops[i];
            const nextStop = visibleStops[i + 1];
            
            // Always add the first stop
            if (i === 0) {
                dedupedStops.push(currentStop);
                continue;
            }
            
            // Check distance from previous added stop
            const prevStop = dedupedStops[dedupedStops.length - 1];
            const distance = currentStop.offset - prevStop.offset;
            
            if (distance > minDistance) {
                // Stops are far enough apart, add it
                dedupedStops.push(currentStop);
            } else {
                // Stops are too close - blend them instead of creating a hard edge
                const t = 0.5; // Blend 50/50
                const blendedColor = this.#interpolateColor(prevStop.color, currentStop.color, t);
                // Replace the previous stop with the blended version at the midpoint
                prevStop.color = blendedColor;
                prevStop.offset = (prevStop.offset + currentStop.offset) / 2;
            }
        }
        
        visibleStops = dedupedStops;
        
        // Ensure we have stops at exactly 0 and 1 for seamless looping
        // To avoid visible seams, we need to interpolate colors at the boundaries
        const epsilon = 0.0001;
        
        if (visibleStops.length > 0) {
            // Check if we need a stop at 0
            if (visibleStops[0].offset > epsilon) {
                // Find the two stops that straddle position 0 (one before, one after)
                const stopBefore = shiftedStops
                    .filter(s => s.offset < 0)
                    .sort((a, b) => b.offset - a.offset)[0]; // Closest to 0 from below
                
                const stopAfter = visibleStops[0]; // First visible stop (after 0)
                
                if (stopBefore && stopAfter) {
                    // Interpolate between the two stops
                    const range = stopAfter.offset - stopBefore.offset;
                    const t = (0 - stopBefore.offset) / range; // Position of 0 in the range
                    const blendedColor = this.#interpolateColor(stopBefore.color, stopAfter.color, t);
                    visibleStops.unshift({ offset: 0, color: blendedColor });
                } else if (stopBefore) {
                    visibleStops.unshift({ offset: 0, color: stopBefore.color });
                } else {
                    // Fallback: use the first visible stop's color
                    visibleStops.unshift({ offset: 0, color: stopAfter.color });
                }
            } else if (Math.abs(visibleStops[0].offset) < epsilon) {
                // Snap to exactly 0
                visibleStops[0].offset = 0;
            }
            
            // Check if we need a stop at 1
            const lastIdx = visibleStops.length - 1;
            if (visibleStops[lastIdx].offset < 1 - epsilon) {
                // Find the two stops that straddle position 1 (one before, one after)
                const stopBefore = visibleStops[lastIdx]; // Last visible stop (before 1)
                
                const stopAfter = shiftedStops
                    .filter(s => s.offset > 1)
                    .sort((a, b) => a.offset - b.offset)[0]; // Closest to 1 from above
                
                if (stopBefore && stopAfter) {
                    // Interpolate between the two stops
                    const range = stopAfter.offset - stopBefore.offset;
                    const t = (1 - stopBefore.offset) / range; // Position of 1 in the range
                    const blendedColor = this.#interpolateColor(stopBefore.color, stopAfter.color, t);
                    visibleStops.push({ offset: 1, color: blendedColor });
                } else if (stopAfter) {
                    visibleStops.push({ offset: 1, color: stopAfter.color });
                } else {
                    // Fallback: use the last visible stop's color
                    visibleStops.push({ offset: 1, color: stopBefore.color });
                }
            } else if (Math.abs(visibleStops[lastIdx].offset - 1) < epsilon) {
                // Snap to exactly 1
                visibleStops[lastIdx].offset = 1;
            }
            
        }
        
        // Draw the gradient
        await canvas.drawGradientRect(0, 0, width, height, visibleStops);

        const layer = await canvas.convertToLayer();
        
        // Apply layer opacity
        await layer.adjustLayerOpacity(context.data.layerOpacity);
        
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
            layerOpacity: this.config.layerOpacity,
            colorStops: [],
        };

        // Build color stops from flat config structure
        const colorConfigs = [
            { color: this.config.color1, position: this.config.position1 },
            { color: this.config.color2, position: this.config.position2 },
            { color: this.config.color3, position: this.config.position3 },
            { color: this.config.color4, position: this.config.position4 },
            { color: this.config.color5, position: this.config.position5 },
        ];

        // Generate loop times once for all stops (ensures synchronization)
        const loopTimes = getRandomIntInclusive(this.config.loopTimes.lower, this.config.loopTimes.upper);

        // Process each color stop
        for (const { color, position } of colorConfigs) {
            // Skip if color or position is null (optional stops)
            if (color === null || position === null) {
                continue;
            }

            // Handle ColorPicker (might be deserialized)
            let colorPicker = color;
            if (colorPicker && typeof colorPicker.getColor !== 'function') {
                // Reconstruct ColorPicker if it was deserialized
                colorPicker = new ColorPicker(colorPicker.selectionType, colorPicker.colorValue);
            }

            // Get the actual color value
            const colorValue = colorPicker?.getColor(settings) ?? settings.getColorFromBucket();

            data.colorStops.push({
                position,
                color: colorValue,
                loopTimes, // Same for all stops to ensure perfect looping
            });
        }

        // Ensure we have at least 2 color stops
        if (data.colorStops.length < 2) {
            throw new Error('RollingGradientEffect requires at least 2 color stops');
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

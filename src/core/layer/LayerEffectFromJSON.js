import { EffectRegistry } from '../registry/EffectRegistry.js';
import { PositionRegistry } from '../registry/PositionRegistry.js';
import { LayerEffect } from './LayerEffect.js';

// Import effects from my-nft-effects-core package
import * as EffectsCore from 'my-nft-effects-core';
import {ArcPath} from "../position/ArcPath.js";
import {Position} from "../position/Position.js";


export class LayerEffectFromJSON {
    static from(json) {
        let layer = new LayerEffect({});

        // Try registry first
        const EffectClass = EffectRegistry.getGlobal(json.name);
        if (EffectClass) {
            layer = Object.assign(new EffectClass({}), json);
        } else {
            // Try to find effect in EffectsCore namespace as fallback
            const effectClassName = json.name.replace(/([A-Z])/g, '$1').trim(); // Convert to class name if needed
            let FoundEffectClass = null;

            // Look for the effect in EffectsCore exports
            for (const [key, value] of Object.entries(EffectsCore)) {
                if (value && typeof value === 'function' && value._name_ === json.name) {
                    FoundEffectClass = value;
                    break;
                }
            }

            if (FoundEffectClass) {
                layer = Object.assign(new FoundEffectClass({}), json);
            } else {
                throw new Error(`Effect '${json.name}' not found in registry or effects core package`);
            }
        }

        layer.data = json.data;

        // Hydrate additionalEffects
        for (let i = 0; i < layer.additionalEffects.length; i++) {
            const { data } = layer.additionalEffects[i];
            
            // Try registry first for additionalEffects
            const AdditionalEffectClass = EffectRegistry.getGlobal(layer.additionalEffects[i].name);
            if (AdditionalEffectClass) {
                layer.additionalEffects[i] = Object.assign(new AdditionalEffectClass({}), layer.additionalEffects[i]);
            } else {
                // Try to find effect in EffectsCore namespace as fallback
                let FoundAdditionalEffectClass = null;

                // Look for the additional effect in EffectsCore exports
                for (const [key, value] of Object.entries(EffectsCore)) {
                    if (value && typeof value === 'function' && value._name_ === layer.additionalEffects[i].name) {
                        FoundAdditionalEffectClass = value;
                        break;
                    }
                }

                if (FoundAdditionalEffectClass) {
                    layer.additionalEffects[i] = Object.assign(new FoundAdditionalEffectClass({}), layer.additionalEffects[i]);
                } else {
                    throw new Error(`Additional effect '${layer.additionalEffects[i].name}' not found in registry or effects core package`);
                }
            }

            layer.additionalEffects[i].data = data;
        }

        // Hydrate layer.data.center if present
        if (layer.data?.center?.name) {
            // Try registry first for positions
            const PositionClass = PositionRegistry.getGlobal(layer.data.center.name);
            if (PositionClass) {
                layer.data.center = Object.assign(new PositionClass({}), layer.data.center);
            } else {
                // Fallback to legacy switch statement
                switch (layer.data.center.name) {
                    case ArcPath._name_:
                        layer.data.center = Object.assign(new ArcPath({}), layer.data.center);
                        break;
                    case Position._name_:
                        layer.data.center = Object.assign(new Position({}), layer.data.center);
                        break;
                    default:
                        throw new Error(`Position type '${layer.data.center.name}' not found in registry or built-in positions`);
                }
            }
        }

        return layer;
    }
}

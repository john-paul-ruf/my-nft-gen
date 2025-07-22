// src/core/layer/EffectHydrator.js
import { LayerEffectFactory } from './LayerEffectFactory.js';
import { EffectRegistry }         from '../../plugin-repo/EffectRegistry.js';

/**
 * Recursively scans any JSON structure and replaces
 * objects whose `name` matches a registered effect
 * with real effect instances via LayerEffectFactory.
 * Also handles nested `effects` arrays on effect configs.
 */
export class EffectHydrator {
    /**
     * @param {*} node - any JSON value or sub-tree
     * @returns {*} - hydrated structure with effects instantiated
     */
    static hydrate(node) {
        // 1) Arrays: hydrate elements
        if (Array.isArray(node)) {
            return node.map(item => EffectHydrator.hydrate(item));
        }

        // 2) Objects: either effect or recurse
        if (node && typeof node === 'object') {
            const { name } = node;

            // 2a) Direct effect config
            if (typeof name === 'string' && EffectRegistry.instance.get(name)) {
                // hydrate nested sub-effects if any
                if (Array.isArray(node.additionalEffects)) {
                    node.additionalEffects = node.additionalEffects.map(eff => EffectHydrator.hydrate(eff));
                }
                // now instantiate this effect (which will itself hydrate params.position, etc.)
                return LayerEffectFactory.createFrom(node);
            }

            // 2b) Not a direct effect: recurse into each property
            const result = {};
            for (const [key, value] of Object.entries(node)) {
                result[key] = EffectHydrator.hydrate(value);
            }
            return result;
        }

        // 3) Primitives: return as-is
        return node;
    }
}

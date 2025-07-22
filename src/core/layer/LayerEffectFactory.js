import {EffectRegistry} from "../../plugin-repo/EffectRegistry.js";
import {BlurEffect} from "../../effects/finalImageEffects/blur/BlurEffect.js";


export class LayerEffectFactory {
        static createFrom(cfg) {
        if (!cfg || typeof cfg.name !== 'string') {
            throw new Error(`Invalid effect config: \${JSON.stringify(cfg)}`);
        }

        // Lookup the constructor in the registry
        const effect = EffectRegistry.instance.get(cfg.name);
        if (!effect) {
            throw new Error(`Unknown effect type '\${cfg.type}'`);
        }

        // Instantiate with params (or empty object)
        return Object.assign(new effect({}), cfg);

    }
}

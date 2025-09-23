import { EffectRegistry } from '../registry/EffectRegistry.js';
import { PositionRegistry } from '../registry/PositionRegistry.js';
import { EnhancedEffectsRegistration } from '../registry/EnhancedEffectsRegistration.js';

export class PluginLoader {
    static #effectsLoaded = false;
    static #loadingPromise = null;

    static async loadCoreEffects() {
        // Use the new enhanced registration system
        return await EnhancedEffectsRegistration.registerEffectsFromPackage('my-nft-effects-core');
    }

    static async ensureEffectsLoaded() {
        if (this.#effectsLoaded) {
            return;
        }

        if (this.#loadingPromise) {
            return this.#loadingPromise;
        }

        this.#loadingPromise = this.loadCoreEffects().then(() => {
            this.#effectsLoaded = true;
            // Core effects loaded successfully
        });

        return this.#loadingPromise;
    }

    static async loadCorePositions() {
        const { registerCorePositions } = await import('../registry/CorePositionsRegistration.js');
        registerCorePositions();
    }

    static async loadPlugin(pluginPath) {
        try {
            const plugin = await import(pluginPath);
            if (plugin.register && typeof plugin.register === 'function') {
                plugin.register(EffectRegistry.globalRegistry, PositionRegistry.globalRegistry);
            }
            return true;
        } catch (error) {
            console.error(`Failed to load plugin at ${pluginPath}:`, error.message);
            return false;
        }
    }

    static async loadPlugins(pluginPaths = []) {
        const results = [];
        for (const pluginPath of pluginPaths) {
            const success = await this.loadPlugin(pluginPath);
            results.push({ path: pluginPath, success });
        }
        return results;
    }
}
import { EffectRegistry } from '../registry/EffectRegistry.js';
import { PositionRegistry } from '../registry/PositionRegistry.js';
import { EnhancedEffectsRegistration } from '../registry/EnhancedEffectsRegistration.js';

export class PluginLoader {
    static #effectsLoaded = false;
    static #loadingPromise = null;
    static #pluginPaths = null;

    static async loadCoreEffects() {
        // Use the new enhanced registration system with bundled effects
        return await EnhancedEffectsRegistration.registerEffectsFromPackage('effects');
    }

    static setPluginPaths(paths) {
        // Store plugin paths for use by workers
        this.#pluginPaths = paths;
    }

    static async ensureEffectsLoaded() {
        if (this.#effectsLoaded) {
            return;
        }

        if (this.#loadingPromise) {
            return this.#loadingPromise;
        }

        this.#loadingPromise = this.loadCoreEffects().then(async () => {
            // Try to auto-load known plugins
            await this.autoLoadKnownPlugins();
            this.#effectsLoaded = true;
            // Core effects loaded successfully
        });

        return this.#loadingPromise;
    }

    /**
     * Auto-load known plugins that should be available
     * This is now delegated to PluginManager in Settings.from()
     */
    static async autoLoadKnownPlugins() {
        // Plugins are now loaded via PluginManager when Settings.from() is called
        // This ensures plugins are only loaded when explicitly provided in settings
        // rather than trying to auto-discover them
        return;
    }

    static async loadCorePositions() {
        const { registerCorePositions } = await import('../registry/CorePositionsRegistration.js');
        registerCorePositions();
    }

    static async loadPlugin(pluginPath) {
        try {
            const plugin = await import(pluginPath);
            if (plugin.register && typeof plugin.register === 'function') {
                // Pass the EffectRegistry class itself, not the instance
                // This allows plugins to use static methods like registerGlobal
                plugin.register(EffectRegistry, PositionRegistry);
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
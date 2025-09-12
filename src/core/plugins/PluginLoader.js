import { EffectRegistry } from '../registry/EffectRegistry.js';
import { PositionRegistry } from '../registry/PositionRegistry.js';

export class PluginLoader {
    static async loadCoreEffects() {
        const { registerCoreEffects } = await import('../registry/CoreEffectsRegistration.js');
        registerCoreEffects();
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
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { PluginLoader } from './PluginLoader.js';
import { EffectRegistry } from '../registry/EffectRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Central Plugin Manager for my-nft-gen
 * Handles plugin discovery, loading, and registration
 */
export class PluginManager {
    static instance = null;

    constructor() {
        if (PluginManager.instance) {
            return PluginManager.instance;
        }

        this.loadedPlugins = new Map();
        this.pluginPaths = new Set();
        PluginManager.instance = this;
    }

    static getInstance() {
        if (!PluginManager.instance) {
            PluginManager.instance = new PluginManager();
        }
        return PluginManager.instance;
    }

    /**
     * Load plugins from settings/config
     * This is the main entry point for loading plugins
     */
    async loadFromSettings(settings) {
        if (!settings.pluginPaths || settings.pluginPaths.length === 0) {
            console.log('ℹ️ No plugins specified in settings');
            return { loaded: 0, failed: 0 };
        }

        const results = {
            loaded: 0,
            failed: 0,
            errors: []
        };

        for (const pluginPath of settings.pluginPaths) {
            try {
                await this.loadPlugin(pluginPath);
                results.loaded++;
            } catch (error) {
                console.error(`❌ Failed to load plugin from ${pluginPath}:`, error.message);
                results.failed++;
                results.errors.push({
                    path: pluginPath,
                    error: error.message
                });
            }
        }

        console.log(`📦 Plugins loaded: ${results.loaded} success, ${results.failed} failed`);
        return results;
    }

    /**
     * Load a single plugin from path
     */
    async loadPlugin(pluginPath) {
        // Ensure core effects are loaded first to avoid circular dependency issues
        const { PluginLoader } = await import('./PluginLoader.js');
        await PluginLoader.ensureEffectsLoaded();

        // Check if already loaded
        if (this.loadedPlugins.has(pluginPath)) {
            console.log(`✓ Plugin already loaded: ${pluginPath}`);
            return true;
        }

        // Validate plugin exists
        try {
            await fs.access(pluginPath);
        } catch (error) {
            throw new Error(`Plugin not found at path: ${pluginPath}`);
        }

        // Determine if it's a file or directory
        const stats = await fs.stat(pluginPath);
        let mainFile = pluginPath;

        if (stats.isDirectory()) {
            // Look for main entry point
            const possibleFiles = ['plugin.js', 'index.js', 'main.js'];
            let found = false;

            for (const file of possibleFiles) {
                const testPath = path.join(pluginPath, file);
                try {
                    await fs.access(testPath);
                    mainFile = testPath;
                    found = true;
                    break;
                } catch (e) {
                    // Continue to next file
                }
            }

            if (!found) {
                // Check package.json for main entry
                try {
                    const packageJsonPath = path.join(pluginPath, 'package.json');
                    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
                    if (packageJson.main) {
                        mainFile = path.join(pluginPath, packageJson.main);
                    } else {
                        throw new Error('No entry point found');
                    }
                } catch (e) {
                    throw new Error(`No valid entry point found in plugin directory: ${pluginPath}`);
                }
            }
        }

        // Import and execute the plugin
        try {
            console.log(`🔄 Loading plugin from ${mainFile}`);
            const pluginModule = await import(`file://${mainFile}`);

            // Check for different plugin formats
            if (pluginModule.register && typeof pluginModule.register === 'function') {
                // Standard plugin with register function
                // Pass both EffectRegistry and PositionRegistry as some plugins may need both
                const { PositionRegistry } = await import('../registry/PositionRegistry.js');
                await pluginModule.register(EffectRegistry, PositionRegistry);
                console.log(`✅ Plugin registered via register() function`);
            } else if (pluginModule.default && typeof pluginModule.default === 'function') {
                // ES module default export
                const { PositionRegistry } = await import('../registry/PositionRegistry.js');
                await pluginModule.default(EffectRegistry, PositionRegistry);
                console.log(`✅ Plugin registered via default export`);
            } else {
                // Plugin might self-register on import (like the current SpiralWave plugin)
                console.log(`✅ Plugin loaded (self-registering)`);
            }

            this.loadedPlugins.set(pluginPath, {
                path: pluginPath,
                mainFile: mainFile,
                loadedAt: new Date().toISOString()
            });

            this.pluginPaths.add(pluginPath);
            return true;
        } catch (error) {
            throw new Error(`Failed to load plugin: ${error.message}`);
        }
    }

    /**
     * Load plugins from project file
     * Used when resuming a project
     */
    async loadFromProjectFile(projectPath) {
        try {
            // Check for .plugins directory in project
            const pluginsDir = path.join(path.dirname(projectPath), '.plugins');
            const manifestPath = path.join(pluginsDir, 'manifest.json');

            try {
                await fs.access(manifestPath);
                const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

                console.log(`📦 Loading ${manifest.plugins.length} bundled plugins`);

                for (const plugin of manifest.plugins) {
                    const pluginPath = path.join(pluginsDir, plugin.id, 'plugin.js');
                    try {
                        await this.loadPlugin(pluginPath);
                    } catch (error) {
                        console.error(`Failed to load bundled plugin ${plugin.name}:`, error.message);
                    }
                }
            } catch (e) {
                // No bundled plugins
                console.log('ℹ️ No bundled plugins found in project');
            }
        } catch (error) {
            console.error('Failed to load plugins from project:', error);
        }
    }

    /**
     * Get list of loaded plugins
     */
    getLoadedPlugins() {
        return Array.from(this.loadedPlugins.values());
    }

    /**
     * Get plugin paths for serialization
     */
    getPluginPaths() {
        return Array.from(this.pluginPaths);
    }

    /**
     * Clear all loaded plugins
     * Useful for testing or resetting state
     */
    clear() {
        this.loadedPlugins.clear();
        this.pluginPaths.clear();
        console.log('🗑️ All plugins cleared');
    }

    /**
     * Check if a specific effect is available (from core or plugins)
     */
    async isEffectAvailable(effectName) {
        // Ensure core effects are loaded
        await PluginLoader.ensureEffectsLoaded();

        // Check registry
        const effect = EffectRegistry.getGlobal(effectName);
        return effect !== null;
    }

    /**
     * Get all available effects (core + plugins)
     */
    async getAllAvailableEffects() {
        // Ensure core effects are loaded
        await PluginLoader.ensureEffectsLoaded();

        const { EffectCategories } = await import('../registry/EffectCategories.js');

        return {
            primary: Object.keys(EffectRegistry.getByCategoryGlobal(EffectCategories.PRIMARY)),
            secondary: Object.keys(EffectRegistry.getByCategoryGlobal(EffectCategories.SECONDARY)),
            keyFrame: Object.keys(EffectRegistry.getByCategoryGlobal(EffectCategories.KEY_FRAME)),
            finalImage: Object.keys(EffectRegistry.getByCategoryGlobal(EffectCategories.FINAL_IMAGE))
        };
    }
}

// Export singleton instance
export default PluginManager.getInstance();
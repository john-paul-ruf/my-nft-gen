import { PluginRegistry } from './PluginRegistry.js';
import { EffectRegistry } from './EffectRegistry.js';
import { ConfigRegistry } from './ConfigRegistry.js';

/**
 * Enhanced effects registration using the new plugin system
 */
export class EnhancedEffectsRegistration {
    static async registerEffectsFromPackage(packageName = 'my-nft-effects-core') {
        try {
            // Registration started - could emit event if eventEmitter available

            // Clear existing registrations
            PluginRegistry.clear();

            // Load plugins from package
            await PluginRegistry.loadFromPackage(packageName);

            // Migrate to legacy registries for backward compatibility
            await this.migrateToLegacyRegistries();

            // Statistics available but not logged to console
            const stats = PluginRegistry.getStats();

            return stats;

        } catch (error) {
            // Error occurred - could emit error event if eventEmitter available
            throw error;
        }
    }

    /**
     * Migrate plugins to legacy EffectRegistry and ConfigRegistry for backward compatibility
     */
    static async migrateToLegacyRegistries() {
        const plugins = PluginRegistry.getAllPlugins();

        // Migration started - could emit event if eventEmitter available

        for (const plugin of plugins) {
            try {
                // Register effect in legacy EffectRegistry
                EffectRegistry.registerGlobal(plugin.effectClass, plugin.category, plugin.metadata);

                // Register config in legacy ConfigRegistry if present
                if (plugin.configClass) {
                    ConfigRegistry.registerGlobal(plugin.name, plugin.configClass, {
                        effectCategory: plugin.category,
                        ...plugin.metadata
                    });
                }

            } catch (error) {
                // Migration error - could emit warning event if eventEmitter available
            }
        }

        // Migration completed - could emit completion event if eventEmitter available
    }

    /**
     * Register a single effect with validation
     */
    static registerEffect(effectClass, category, metadata = {}) {
        const plugin = {
            name: effectClass._name_,
            category,
            effectClass,
            configClass: effectClass._configClass_ || null,
            metadata
        };

        return PluginRegistry.register(plugin);
    }

    /**
     * Get comprehensive registration report
     */
    static getRegistrationReport() {
        const pluginStats = PluginRegistry.getStats();
        const legacyEffects = EffectRegistry.getAllGlobal();
        const legacyConfigs = ConfigRegistry.getAllGlobal();

        return {
            modern: {
                plugins: pluginStats.total,
                withConfigs: pluginStats.withConfigs,
                byCategory: pluginStats.byCategory,
                loadedPackages: pluginStats.loadedPackages
            },
            legacy: {
                effects: legacyEffects.length,
                configs: legacyConfigs.length
            },
            discrepancies: {
                missingConfigs: legacyEffects.filter(effect =>
                    !legacyConfigs.some(config => config.effectName === effect.name)
                ).map(effect => effect.name),
                orphanedConfigs: legacyConfigs.filter(config =>
                    !legacyEffects.some(effect => effect.name === config.effectName)
                ).map(config => config.effectName)
            }
        };
    }

    /**
     * Validate all registered plugins
     */
    static validateAllPlugins() {
        const plugins = PluginRegistry.getAllPlugins();
        const issues = [];

        for (const plugin of plugins) {
            try {
                // Test effect instantiation
                const effectInstance = new plugin.effectClass({
                    name: plugin.name,
                    config: plugin.configClass ? new plugin.configClass({}) : {}
                });

                // Test invoke method exists
                if (typeof effectInstance.invoke !== 'function') {
                    issues.push({
                        plugin: plugin.name,
                        type: 'missing_invoke',
                        message: 'Effect missing invoke method'
                    });
                }

                // Test config if present
                if (plugin.configClass) {
                    try {
                        new plugin.configClass({});
                    } catch (configError) {
                        issues.push({
                            plugin: plugin.name,
                            type: 'config_error',
                            message: `Config validation failed: ${configError.message}`
                        });
                    }
                }

            } catch (error) {
                issues.push({
                    plugin: plugin.name,
                    type: 'instantiation_error',
                    message: `Effect instantiation failed: ${error.message}`
                });
            }
        }

        return {
            totalPlugins: plugins.length,
            validPlugins: plugins.length - issues.length,
            issues
        };
    }
}
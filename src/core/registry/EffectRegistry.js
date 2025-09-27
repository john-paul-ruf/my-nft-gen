import { EffectCategories, isValidCategory } from './EffectCategories.js';
import { ConfigRegistry } from './ConfigRegistry.js';
import { PluginRegistry } from './PluginRegistry.js';

/**
 * EffectRegistry - Now a facade/adapter for PluginRegistry
 * Maintains backward compatibility while using PluginRegistry as the single source of truth
 */
export class EffectRegistry {
    static globalRegistry = new EffectRegistry();

    constructor() {
        // No longer store data here - delegate to PluginRegistry
        // Keep these for potential instance-based registries (non-global)
        this.effects = new Map();
        this.categories = new Map();
        this.metadata = new Map();
    }

    register(effectClass, category, metadata = {}) {
        if (!effectClass) {
            throw new Error('Effect class is required');
        }

        if (!effectClass._name_) {
            throw new Error('Effect class must have a static _name_ property');
        }

        if (!isValidCategory(category)) {
            throw new Error(`Invalid category: ${category}. Must be one of: ${Object.values(EffectCategories).join(', ')}`);
        }

        const name = effectClass._name_;
        
        if (this.effects.has(name)) {
            throw new Error(`Effect with name '${name}' is already registered`);
        }

        this.effects.set(name, effectClass);
        this.categories.set(name, category);
        this.metadata.set(name, {
            description: metadata.description || '',
            version: metadata.version || '1.0.0',
            author: metadata.author || 'unknown',
            tags: metadata.tags || [],
            ...metadata
        });

        // If the effect has a config class, register it in the ConfigRegistry
        if (effectClass.configClass) {
            ConfigRegistry.registerGlobal(name, effectClass.configClass, {
                effectCategory: category,
                ...metadata
            });
        }

        return this;
    }

    get(name) {
        return this.effects.get(name);
    }

    has(name) {
        return this.effects.has(name);
    }

    getByCategory(category) {
        if (!isValidCategory(category)) {
            throw new Error(`Invalid category: ${category}`);
        }

        return Array.from(this.effects.entries())
            .filter(([name]) => this.categories.get(name) === category)
            .map(([name, effectClass]) => ({
                name,
                effectClass,
                category,
                metadata: this.metadata.get(name)
            }));
    }

    getAllEffects() {
        return Array.from(this.effects.entries()).map(([name, effectClass]) => ({
            name,
            effectClass,
            category: this.categories.get(name),
            metadata: this.metadata.get(name)
        }));
    }

    getMetadata(name) {
        return this.metadata.get(name);
    }

    unregister(name) {
        const wasRegistered = this.effects.has(name);
        this.effects.delete(name);
        this.categories.delete(name);
        this.metadata.delete(name);

        // Also unregister from ConfigRegistry
        ConfigRegistry.globalRegistry.unregister(name);

        return wasRegistered;
    }

    clear() {
        this.effects.clear();
        this.categories.clear();
        this.metadata.clear();

        // Also clear the ConfigRegistry
        ConfigRegistry.clearGlobal();
    }

    size() {
        return this.effects.size;
    }

    static registerGlobal(effectClass, category, metadata = {}) {
        // Delegate to PluginRegistry as single source of truth
        const pluginDefinition = {
            name: effectClass._name_,
            category,
            effectClass,
            configClass: effectClass._configClass_ || effectClass.configClass || null,
            metadata: {
                description: metadata.description || effectClass._description_ || '',
                version: metadata.version || effectClass._version_ || '1.0.0',
                author: metadata.author || effectClass._author_ || 'unknown',
                tags: metadata.tags || effectClass._tags_ || [],
                ...metadata,
                ...(effectClass._metadata_ || {})
            }
        };

        return PluginRegistry.globalRegistry.register(pluginDefinition);
    }

    static getGlobal(name) {
        // Delegate to PluginRegistry
        const plugin = PluginRegistry.globalRegistry.get(name);
        return plugin ? plugin.effectClass : undefined;
    }

    static hasGlobal(name) {
        // Delegate to PluginRegistry
        return PluginRegistry.globalRegistry.has(name);
    }

    static getAllGlobal() {
        // Delegate to PluginRegistry
        return PluginRegistry.globalRegistry.getAllPlugins().map(plugin => ({
            name: plugin.name,
            effectClass: plugin.effectClass,
            category: plugin.category,
            metadata: plugin.metadata
        }));
    }

    static getByCategoryGlobal(category) {
        // Delegate to PluginRegistry and return in old format for compatibility
        const plugins = PluginRegistry.globalRegistry.getByCategory(category);
        // Convert to object format expected by old code
        const result = {};
        plugins.forEach(plugin => {
            result[plugin.name] = plugin.effectClass;
        });
        return result;
    }

    static clearGlobal() {
        // Delegate to PluginRegistry
        PluginRegistry.globalRegistry.clear();
    }
}
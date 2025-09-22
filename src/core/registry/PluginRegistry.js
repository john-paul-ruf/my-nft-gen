import { EffectCategories, isValidCategory } from './EffectCategories.js';

/**
 * Modern plugin registry with self-registration and validation
 */
export class PluginRegistry {
    static globalRegistry = new PluginRegistry();

    constructor() {
        this.plugins = new Map();
        this.metadata = new Map();
        this.loadedPackages = new Set();
    }

    /**
     * Register a plugin with full validation
     */
    register(pluginDefinition) {
        const plugin = this.validatePlugin(pluginDefinition);

        if (this.plugins.has(plugin.name)) {
            // Plugin overwrite warning - could emit warning event if eventEmitter available
        }

        this.plugins.set(plugin.name, {
            effectClass: plugin.effectClass,
            configClass: plugin.configClass,
            category: plugin.category,
            metadata: plugin.metadata
        });

        this.metadata.set(plugin.name, plugin.metadata);

        // Plugin registered - could emit registration event if eventEmitter available
        return this;
    }

    /**
     * Auto-register an effect class that has static properties
     */
    autoRegister(effectClass) {
        if (!effectClass._name_) {
            throw new Error('Effect class must have static _name_ property for auto-registration');
        }

        const plugin = {
            name: effectClass._name_,
            category: effectClass._category_ || 'primary',
            effectClass,
            configClass: effectClass._configClass_ || null,
            metadata: {
                description: effectClass._description_ || '',
                version: effectClass._version_ || '1.0.0',
                author: effectClass._author_ || 'unknown',
                tags: effectClass._tags_ || [],
                ...(effectClass._metadata_ || {})
            }
        };

        return this.register(plugin);
    }

    /**
     * Load plugins from a package using its registration function
     */
    async loadFromPackage(packageName, options = {}) {
        if (this.loadedPackages.has(packageName)) {
            // Package already loaded - could emit info event if eventEmitter available
            return;
        }

        try {
            // Loading package - could emit loading event if eventEmitter available

            // Import the package's registration function
            const packageModule = await import(packageName);
            const registerFn = packageModule.register || packageModule.default?.register;

            if (!registerFn || typeof registerFn !== 'function') {
                throw new Error(`Package '${packageName}' does not export a 'register' function`);
            }

            // Create a registry adapter that captures registrations
            const registryAdapter = {
                register: (effectClass, category) => {
                    // Create a proper plugin definition for the registry
                    const plugin = {
                        name: effectClass._name_,
                        category,
                        effectClass,
                        configClass: effectClass._configClass_ || null,
                        metadata: {
                            description: effectClass._description_ || '',
                            version: effectClass._version_ || '1.0.0',
                            author: effectClass._author_ || 'unknown',
                            tags: effectClass._tags_ || [],
                            ...(effectClass._metadata_ || {})
                        }
                    };
                    this.register(plugin);
                }
            };

            // Use the package's registration function
            await registerFn(registryAdapter, null);
            this.loadedPackages.add(packageName);

            const pluginCount = this.plugins.size;
            // Successfully loaded plugins - could emit success event if eventEmitter available

        } catch (error) {
            // Failed to load package - could emit error event if eventEmitter available
            throw error;
        }
    }

    /**
     * Discover and load plugins from a directory structure
     */
    async discoverFromDirectory(basePath, options = {}) {
        const {
            categories = ['primaryEffects', 'secondaryEffects', 'finalImageEffects', 'keyFrameEffects'],
            naming = 'convention' // or 'manifest'
        } = options;

        // Discovering plugins - could emit discovery event if eventEmitter available
        let discovered = 0;

        for (const categoryDir of categories) {
            try {
                const categoryPath = `${basePath}/${categoryDir}`;
                const category = this.mapCategoryDirToCategory(categoryDir);

                const effectDirs = await this.getDirectories(categoryPath);

                for (const dirName of effectDirs) {
                    try {
                        const pluginPath = `${categoryPath}/${dirName}`;

                        if (naming === 'manifest') {
                            await this.loadFromManifest(pluginPath, category);
                        } else {
                            await this.loadByConvention(pluginPath, category, dirName);
                        }

                        discovered++;
                    } catch (error) {
                        // Failed to load plugin - could emit warning event if eventEmitter available
                    }
                }
            } catch (error) {
                // Failed to scan category - could emit warning event if eventEmitter available
            }
        }

        // Discovery completed - could emit completion event if eventEmitter available
    }

    /**
     * Validate a plugin definition
     */
    validatePlugin(definition) {
        const required = ['name', 'category', 'effectClass'];
        const missing = required.filter(field => !definition[field]);

        if (missing.length > 0) {
            throw new Error(`Plugin missing required fields: ${missing.join(', ')}`);
        }

        if (!isValidCategory(definition.category)) {
            throw new Error(`Invalid category: ${definition.category}. Must be one of: ${Object.values(EffectCategories).join(', ')}`);
        }

        if (typeof definition.effectClass !== 'function') {
            throw new Error('effectClass must be a constructor function');
        }

        if (!definition.effectClass._name_) {
            throw new Error('Effect class must have static _name_ property');
        }

        if (typeof definition.effectClass.prototype.invoke !== 'function') {
            throw new Error('Effect class must have invoke method');
        }

        if (definition.configClass && typeof definition.configClass !== 'function') {
            throw new Error('configClass must be a constructor function');
        }

        // Test config instantiation if provided
        if (definition.configClass) {
            try {
                new definition.configClass({});
            } catch (error) {
                throw new Error(`Config class validation failed: ${error.message}`);
            }
        }

        return {
            name: definition.name,
            category: definition.category,
            effectClass: definition.effectClass,
            configClass: definition.configClass || null,
            metadata: {
                description: '',
                version: '1.0.0',
                author: 'unknown',
                tags: [],
                ...(definition.metadata || {})
            }
        };
    }

    /**
     * Get a plugin by name
     */
    get(name) {
        return this.plugins.get(name);
    }

    /**
     * Get effect class by name
     */
    getEffectClass(name) {
        const plugin = this.plugins.get(name);
        return plugin?.effectClass || null;
    }

    /**
     * Get config class by name
     */
    getConfigClass(name) {
        const plugin = this.plugins.get(name);
        return plugin?.configClass || null;
    }

    /**
     * Check if plugin exists
     */
    has(name) {
        return this.plugins.has(name);
    }

    /**
     * Get plugins by category
     */
    getByCategory(category) {
        if (!isValidCategory(category)) {
            throw new Error(`Invalid category: ${category}`);
        }

        return Array.from(this.plugins.entries())
            .filter(([, plugin]) => plugin.category === category)
            .map(([name, plugin]) => ({
                name,
                ...plugin,
                metadata: this.metadata.get(name)
            }));
    }

    /**
     * Get all plugins
     */
    getAllPlugins() {
        return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
            name,
            ...plugin,
            metadata: this.metadata.get(name)
        }));
    }

    /**
     * Get statistics
     */
    getStats() {
        const stats = {
            total: this.plugins.size,
            byCategory: {},
            withConfigs: 0,
            loadedPackages: Array.from(this.loadedPackages)
        };

        for (const category of Object.values(EffectCategories)) {
            stats.byCategory[category] = this.getByCategory(category).length;
        }

        stats.withConfigs = Array.from(this.plugins.values())
            .filter(plugin => plugin.configClass).length;

        return stats;
    }

    /**
     * Clear all plugins
     */
    clear() {
        this.plugins.clear();
        this.metadata.clear();
        this.loadedPackages.clear();
    }

    // Helper methods
    mapCategoryDirToCategory(categoryDir) {
        const mapping = {
            'primaryEffects': 'primary',
            'secondaryEffects': 'secondary',
            'finalImageEffects': 'final',
            'keyFrameEffects': 'keyframe'
        };
        return mapping[categoryDir] || 'primary';
    }

    async getDirectories(path) {
        // This would need to be implemented based on environment
        // For now, returning empty array as placeholder
        return [];
    }

    async loadFromManifest(pluginPath, category) {
        // Manifest-based loading implementation
        throw new Error('Manifest-based loading not yet implemented');
    }

    async loadByConvention(pluginPath, category, dirName) {
        // Convention-based loading implementation
        throw new Error('Convention-based loading not yet implemented');
    }

    // Static methods for global registry
    static register(pluginDefinition) {
        return this.globalRegistry.register(pluginDefinition);
    }

    static autoRegister(effectClass) {
        return this.globalRegistry.autoRegister(effectClass);
    }

    static async loadFromPackage(packageName, options = {}) {
        return this.globalRegistry.loadFromPackage(packageName, options);
    }

    static get(name) {
        return this.globalRegistry.get(name);
    }

    static getEffectClass(name) {
        return this.globalRegistry.getEffectClass(name);
    }

    static getConfigClass(name) {
        return this.globalRegistry.getConfigClass(name);
    }

    static has(name) {
        return this.globalRegistry.has(name);
    }

    static getByCategory(category) {
        return this.globalRegistry.getByCategory(category);
    }

    static getAllPlugins() {
        return this.globalRegistry.getAllPlugins();
    }

    static getStats() {
        return this.globalRegistry.getStats();
    }

    static clear() {
        this.globalRegistry.clear();
    }
}
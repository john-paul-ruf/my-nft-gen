export class ConfigRegistry {
    static globalRegistry = new ConfigRegistry();

    constructor() {
        this.configs = new Map();
        this.metadata = new Map();
    }

    register(effectName, configClass, metadata = {}) {
        if (!effectName) {
            throw new Error('Effect name is required');
        }

        if (!configClass) {
            throw new Error('Config class is required');
        }

        if (this.configs.has(effectName)) {
            console.warn(`Config for effect '${effectName}' is already registered, overwriting`);
        }

        this.configs.set(effectName, configClass);
        this.metadata.set(effectName, {
            description: metadata.description || '',
            version: metadata.version || '1.0.0',
            author: metadata.author || 'unknown',
            configType: configClass.name || 'unknown',
            ...metadata
        });

        return this;
    }

    get(effectName) {
        const configClass = this.configs.get(effectName);
        if (!configClass) {
            return null;
        }

        // Return in the format expected by nft-studio
        return {
            ConfigClass: configClass,
            metadata: this.metadata.get(effectName)
        };
    }

    getConfigClass(effectName) {
        // Direct access to the config class without wrapping
        return this.configs.get(effectName);
    }

    has(effectName) {
        return this.configs.has(effectName);
    }

    getMetadata(effectName) {
        return this.metadata.get(effectName);
    }

    getAllConfigs() {
        return Array.from(this.configs.entries()).map(([effectName, configClass]) => ({
            effectName,
            configClass,
            metadata: this.metadata.get(effectName)
        }));
    }

    unregister(effectName) {
        const wasRegistered = this.configs.has(effectName);
        this.configs.delete(effectName);
        this.metadata.delete(effectName);
        return wasRegistered;
    }

    clear() {
        this.configs.clear();
        this.metadata.clear();
    }

    size() {
        return this.configs.size;
    }

    static registerGlobal(effectName, configClass, metadata = {}) {
        return this.globalRegistry.register(effectName, configClass, metadata);
    }

    static getGlobal(effectName) {
        return this.globalRegistry.get(effectName);
    }

    static getConfigClassGlobal(effectName) {
        return this.globalRegistry.getConfigClass(effectName);
    }

    static hasGlobal(effectName) {
        return this.globalRegistry.has(effectName);
    }

    static getAllGlobal() {
        return this.globalRegistry.getAllConfigs();
    }

    static clearGlobal() {
        this.globalRegistry.clear();
    }

    static getMetadataGlobal(effectName) {
        return this.globalRegistry.getMetadata(effectName);
    }
}
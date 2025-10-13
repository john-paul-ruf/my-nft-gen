/**
 * PresetRegistry - Registry for effect presets
 * Allows registration and lookup of presets by effect name
 * Follows the same pattern as EffectRegistry and ConfigRegistry
 */
export class PresetRegistry {
    static globalRegistry = new PresetRegistry();

    constructor() {
        // Map of effect name -> array of presets
        this.presets = new Map();
        // Map of effect name -> preset metadata
        this.metadata = new Map();
    }

    /**
     * Register preset(s) for an effect
     * @param {string} effectName - Effect name (registry key)
     * @param {Array|Object} presets - Single preset or array of presets
     * @param {Object} metadata - Optional metadata about the preset collection
     * @returns {PresetRegistry} - For chaining
     */
    register(effectName, presets, metadata = {}) {
        if (!effectName) {
            throw new Error('Effect name is required');
        }

        if (!presets) {
            throw new Error('Presets are required');
        }

        // Normalize to array
        const presetArray = Array.isArray(presets) ? presets : [presets];

        // Validate each preset has required fields
        presetArray.forEach((preset, index) => {
            if (!preset.name) {
                throw new Error(`Preset at index ${index} for effect '${effectName}' must have a 'name' field`);
            }
            if (!preset.effect) {
                throw new Error(`Preset at index ${index} for effect '${effectName}' must have an 'effect' field`);
            }
        });

        // Store presets
        if (this.presets.has(effectName)) {
            // Append to existing presets
            const existing = this.presets.get(effectName);
            this.presets.set(effectName, [...existing, ...presetArray]);
        } else {
            this.presets.set(effectName, presetArray);
        }

        // Store metadata
        this.metadata.set(effectName, {
            effectName,
            presetCount: this.presets.get(effectName).length,
            description: metadata.description || '',
            version: metadata.version || '1.0.0',
            author: metadata.author || 'unknown',
            tags: metadata.tags || [],
            ...metadata
        });

        return this;
    }

    /**
     * Get all presets for an effect
     * @param {string} effectName - Effect name
     * @returns {Array|null} - Array of presets or null if not found
     */
    get(effectName) {
        return this.presets.get(effectName) || null;
    }

    /**
     * Get a specific preset by effect name and preset name
     * @param {string} effectName - Effect name
     * @param {string} presetName - Preset name
     * @returns {Object|null} - Preset object or null if not found
     */
    getPreset(effectName, presetName) {
        const presets = this.presets.get(effectName);
        if (!presets) return null;

        return presets.find(p => p.name === presetName) || null;
    }

    /**
     * Check if effect has registered presets
     * @param {string} effectName - Effect name
     * @returns {boolean}
     */
    has(effectName) {
        return this.presets.has(effectName);
    }

    /**
     * Get metadata for effect's presets
     * @param {string} effectName - Effect name
     * @returns {Object|null}
     */
    getMetadata(effectName) {
        return this.metadata.get(effectName) || null;
    }

    /**
     * Get all registered presets across all effects
     * @returns {Array} - Array of {effectName, presets, metadata}
     */
    getAllPresets() {
        return Array.from(this.presets.entries()).map(([effectName, presets]) => ({
            effectName,
            presets,
            metadata: this.metadata.get(effectName)
        }));
    }

    /**
     * Get preset names for an effect
     * @param {string} effectName - Effect name
     * @returns {Array<string>} - Array of preset names
     */
    getPresetNames(effectName) {
        const presets = this.presets.get(effectName);
        if (!presets) return [];
        return presets.map(p => p.name);
    }

    /**
     * Unregister all presets for an effect
     * @param {string} effectName - Effect name
     * @returns {boolean} - True if presets were removed
     */
    unregister(effectName) {
        const wasRegistered = this.presets.has(effectName);
        this.presets.delete(effectName);
        this.metadata.delete(effectName);
        return wasRegistered;
    }

    /**
     * Unregister a specific preset
     * @param {string} effectName - Effect name
     * @param {string} presetName - Preset name
     * @returns {boolean} - True if preset was removed
     */
    unregisterPreset(effectName, presetName) {
        const presets = this.presets.get(effectName);
        if (!presets) return false;

        const initialLength = presets.length;
        const filtered = presets.filter(p => p.name !== presetName);
        
        if (filtered.length === 0) {
            // No presets left, remove the effect entry
            this.presets.delete(effectName);
            this.metadata.delete(effectName);
        } else {
            this.presets.set(effectName, filtered);
            // Update metadata count
            const meta = this.metadata.get(effectName);
            if (meta) {
                meta.presetCount = filtered.length;
            }
        }

        return filtered.length < initialLength;
    }

    /**
     * Clear all registered presets
     */
    clear() {
        this.presets.clear();
        this.metadata.clear();
    }

    /**
     * Get total number of effects with presets
     * @returns {number}
     */
    size() {
        return this.presets.size;
    }

    /**
     * Get total number of presets across all effects
     * @returns {number}
     */
    totalPresets() {
        let total = 0;
        for (const presets of this.presets.values()) {
            total += presets.length;
        }
        return total;
    }

    // Static methods for global registry

    static registerGlobal(effectName, presets, metadata = {}) {
        return this.globalRegistry.register(effectName, presets, metadata);
    }

    static getGlobal(effectName) {
        return this.globalRegistry.get(effectName);
    }

    static getPresetGlobal(effectName, presetName) {
        return this.globalRegistry.getPreset(effectName, presetName);
    }

    static hasGlobal(effectName) {
        return this.globalRegistry.has(effectName);
    }

    static getMetadataGlobal(effectName) {
        return this.globalRegistry.getMetadata(effectName);
    }

    static getAllGlobal() {
        return this.globalRegistry.getAllPresets();
    }

    static getPresetNamesGlobal(effectName) {
        return this.globalRegistry.getPresetNames(effectName);
    }

    static unregisterGlobal(effectName) {
        return this.globalRegistry.unregister(effectName);
    }

    static unregisterPresetGlobal(effectName, presetName) {
        return this.globalRegistry.unregisterPreset(effectName, presetName);
    }

    static clearGlobal() {
        this.globalRegistry.clear();
    }

    static sizeGlobal() {
        return this.globalRegistry.size();
    }

    static totalPresetsGlobal() {
        return this.globalRegistry.totalPresets();
    }
}
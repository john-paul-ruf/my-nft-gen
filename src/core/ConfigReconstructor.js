import { PluginRegistry } from './registry/PluginRegistry.js';
import { EnhancedEffectsRegistration } from './registry/EnhancedEffectsRegistration.js';
import { ConfigLinker } from './registry/ConfigLinker.js';

/**
 * Handles reconstruction of config objects from plain JSON to proper instances
 * Fixes serialization issues where Range, ColorPicker, etc. lose their methods
 */
export class ConfigReconstructor {
    static initialized = false;

    /**
     * Ensure the plugin registry is initialized
     */
    static async ensureInitialized() {
        if (!this.initialized) {
            try {
                const stats = PluginRegistry.getStats();
                // ConfigReconstructor.ensureInitialized called
                if (stats.total === 0) {
                    // Initializing config reconstruction system...
                    await EnhancedEffectsRegistration.registerEffectsFromPackage();
                    await ConfigLinker.linkEffectsWithConfigs();
                    // Config reconstruction system initialized
                } else {
                    // Registry already initialized with effects
                    // Check if configs are linked, if not, link them
                    if (stats.withConfigs === 0) {
                        // Linking configs to existing effects...
                        await ConfigLinker.linkEffectsWithConfigs();
                        // Config linking completed
                    }
                }
                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize config reconstruction:', error);
            }
        }
    }

    /**
     * Reconstruct a config object from plain JSON to proper config instance
     * @param {string} effectName - The effect name (e.g., 'hex', 'fuzz-flare')
     * @param {Object} plainConfig - Plain object config (from JSON serialization)
     * @returns {Object} Proper config instance with methods
     */
    static async reconstruct(effectName, plainConfig) {
        // ConfigReconstructor.reconstruct called for effect: ${effectName}
        await this.ensureInitialized();

        try {
            // Get the plugin with linked config class
            const plugin = PluginRegistry.get(effectName);
            if (!plugin || !plugin.configClass) {
                console.warn(`⚠ No config class found for effect: ${effectName}, using plain config`);
                console.warn(`Available plugins:`, PluginRegistry.getAllPlugins().map(p => p.name).slice(0, 10));
                return plainConfig;
            }

            // Reconstructing config for ${effectName} using ${plugin.configClass.name}

            // Pre-process plainConfig to reconstruct serialized objects before passing to constructor
            const preprocessedConfig = await this.preprocessConfig(plainConfig);

            // Create new config instance - this should properly reconstruct Range, ColorPicker, etc.
            const reconstructedConfig = new plugin.configClass(preprocessedConfig);

            // Verify the reconstruction worked
            if (reconstructedConfig.innerColor) {
                if (typeof reconstructedConfig.innerColor.getColor !== 'function') {
                    console.error(`❌ innerColor reconstruction failed for ${effectName}`);
                    console.error(`innerColor type:`, typeof reconstructedConfig.innerColor);
                    console.error(`innerColor getColor type:`, typeof reconstructedConfig.innerColor.getColor);
                    console.error(`innerColor:`, reconstructedConfig.innerColor);
                } else {
                    // innerColor properly reconstructed for ${effectName}
                }
            }

            // Config reconstruction completed for ${effectName}
            return reconstructedConfig;

        } catch (error) {
            console.error(`❌ Failed to reconstruct config for ${effectName}:`, error.message);
            console.error(`Stack:`, error.stack);

            // Try to return at least the preprocessed config, even if the full reconstruction failed
            try {
                const preprocessedConfig = await this.preprocessConfig(plainConfig);
                // Returning preprocessed config as fallback for ${effectName}
                return preprocessedConfig;
            } catch (preprocessError) {
                console.error(`❌ Preprocessing also failed:`, preprocessError.message);
                // Return plain config as final fallback to prevent crashes
                return plainConfig;
            }
        }
    }

    /**
     * Reconstruct multiple configs
     * @param {Array} effects - Array of {name, config} objects
     * @returns {Array} Array with reconstructed configs
     */
    static async reconstructMany(effects) {
        await this.ensureInitialized();

        const results = [];
        for (const effect of effects) {
            const reconstructedConfig = await this.reconstruct(effect.name, effect.config);
            results.push({
                ...effect,
                config: reconstructedConfig
            });
        }
        return results;
    }

    /**
     * Pre-process config to reconstruct serialized objects
     * @param {Object} config - Plain config object that may contain serialized objects
     * @returns {Object} Config with reconstructed objects
     */
    static async preprocessConfig(config) {
        if (!config || typeof config !== 'object') {
            return config;
        }

        const processed = { ...config };

        // Recursively process nested objects
        for (const [key, value] of Object.entries(processed)) {
            if (value && typeof value === 'object') {
                try {
                    // Check if this is a serialized ColorPicker
                    if (value.__className === 'ColorPicker') {
                        // Reconstructing ColorPicker for ${key}
                        const { ColorPicker } = await import('./layer/configType/ColorPicker.js');
                        processed[key] = new ColorPicker(value.selectionType, value.colorValue);
                    }
                    // Check if this is a serialized Range
                    else if (value.__className === 'Range' && value.hasOwnProperty('_lower') && value.hasOwnProperty('_upper')) {
                        // Reconstructing Range for ${key}
                        const { Range } = await import('./layer/configType/Range.js');
                        processed[key] = new Range(value._lower, value._upper);
                    }
                    // Check if this is a serialized PercentageRange (with or without __className)
                    else if (value.__className === 'PercentageRange' || this.looksLikePercentageRange(value)) {
                        // Reconstructing PercentageRange for ${key}
                        const { PercentageRange } = await import('./layer/configType/PercentageRange.js');
                        const { PercentageShortestSide } = await import('./layer/configType/PercentageShortestSide.js');
                        const { PercentageLongestSide } = await import('./layer/configType/PercentageLongestSide.js');

                        // PercentageRange constructor expects PercentageShortestSide and PercentageLongestSide objects
                        // The serialized data might have nested objects with percent values
                        let lowerPercent = 0;
                        let upperPercent = 1;
                        let lowerSide = 'shortest';
                        let upperSide = 'longest';

                        // Check if lower/upper are already percentage objects with percent property
                        if (value.lower && typeof value.lower === 'object' && value.lower.percent !== undefined) {
                            lowerPercent = value.lower.percent;
                            lowerSide = value.lower.side || 'shortest';
                        } else if (typeof value.lower === 'number') {
                            lowerPercent = value.lower;
                        }

                        if (value.upper && typeof value.upper === 'object' && value.upper.percent !== undefined) {
                            upperPercent = value.upper.percent;
                            upperSide = value.upper.side || 'longest';
                        } else if (typeof value.upper === 'number') {
                            upperPercent = value.upper;
                        }

                        // Create proper PercentageShortestSide or PercentageLongestSide based on 'side' property
                        const lowerSideClass = lowerSide === 'shortest' ? PercentageShortestSide : PercentageLongestSide;
                        const upperSideClass = upperSide === 'shortest' ? PercentageShortestSide : PercentageLongestSide;

                        processed[key] = new PercentageRange(
                            new lowerSideClass(lowerPercent),
                            new upperSideClass(upperPercent)
                        );
                    }
                    // Check if this is a serialized DynamicRange
                    else if (value.__className === 'DynamicRange') {
                        // Reconstructing DynamicRange for ${key}
                        const { DynamicRange } = await import('./layer/configType/DynamicRange.js');
                        // DynamicRange contains nested Range objects (bottom and top, not min/max)
                        const processedBottom = await this.preprocessConfig(value.bottom);
                        const processedTop = await this.preprocessConfig(value.top);
                        processed[key] = new DynamicRange(processedBottom, processedTop);
                    }
                    // Recursively process nested objects
                    else if (!Array.isArray(value)) {
                        processed[key] = await this.preprocessConfig(value);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to reconstruct ${key}:`, error.message);
                    // Keep the original value if reconstruction fails
                    processed[key] = value;
                }
            }
        }

        return processed;
    }

    /**
     * Check if an effect has a proper config class available
     * @param {string} effectName - The effect name
     * @returns {boolean} True if config class is available
     */
    static async hasConfigClass(effectName) {
        await this.ensureInitialized();
        const plugin = PluginRegistry.get(effectName);
        return !!(plugin && plugin.configClass);
    }

    /**
     * Detect if an object looks like a PercentageRange based on structure
     * @param {Object} obj - Object to check
     * @returns {boolean} True if it looks like a PercentageRange
     */
    static looksLikePercentageRange(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }

        // Check if it has lower and upper properties with percent and side structure
        if (obj.hasOwnProperty('lower') && obj.hasOwnProperty('upper')) {
            const lower = obj.lower;
            const upper = obj.upper;

            // Check if lower and upper have percent/side structure (PercentageRange)
            if (lower && typeof lower === 'object' &&
                lower.hasOwnProperty('percent') && lower.hasOwnProperty('side') &&
                upper && typeof upper === 'object' &&
                upper.hasOwnProperty('percent') && upper.hasOwnProperty('side')) {
                return true;
            }
        }

        return false;
    }
}
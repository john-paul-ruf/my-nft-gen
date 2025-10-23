// APPROACH 1: Self-Registering Plugins with Static Properties
// Each effect exports both the effect and config, and they register themselves

// Example Effect File: EncircledSpiralEffect.js
export class EncircledSpiralEffect extends LayerEffect {
    static _name_ = 'encircled-spiral-round-2';
    static _category_ = 'primary';
    static _configClass_ = EncircledSpiralConfig; // Direct reference
    static _metadata_ = {
        description: 'Creates N spirals based on sequence and rings',
        version: '2.0.0',
        author: 'core',
        tags: ['spiral', 'geometric', 'animated']
    };

    // Effect implementation...
}

// The config is co-located and imported
import { EncircledSpiralConfig } from './EncircledSpiralConfig.js';

// Auto-registration on module load
EffectRegistry.autoRegister(EncircledSpiralEffect);

// ========================================
// APPROACH 2: Plugin Manifest System
// ========================================

// Each effect directory has a manifest.json:
const exampleManifest = {
    "name": "encircled-spiral-round-2",
    "category": "primary",
    "version": "2.0.0",
    "author": "core",
    "description": "Creates N spirals based on sequence and rings",
    "tags": ["spiral", "geometric", "animated"],
    "files": {
        "effect": "./EncircledSpiralEffect.js",
        "config": "./EncircledSpiralConfig.js",
        "exports": {
            "effect": "EncircledSpiralEffect",
            "config": "EncircledSpiralConfig"
        }
    },
    "dependencies": [],
    "compatibleVersions": [">=1.5.0"]
};

// ========================================
// APPROACH 3: Plugin Discovery with Registry
// ========================================

export class PluginRegistry {
    static plugins = new Map();

    // Scan and auto-discover plugins
    static async discoverPlugins(basePath = './src/effects') {
        const categories = ['primaryEffects', 'secondaryEffects', 'finalImageEffects', 'keyFrameEffects'];

        for (const category of categories) {
            const categoryPath = `${basePath}/${category}`;
            const effectDirs = await this.getDirectories(categoryPath);

            for (const dir of effectDirs) {
                await this.loadPlugin(`${categoryPath}/${dir}`, category);
            }
        }
    }

    static async loadPlugin(pluginPath, category) {
        try {
            // Try manifest-based loading first
            const manifest = await this.tryLoadManifest(`${pluginPath}/manifest.json`);
            if (manifest) {
                return await this.loadFromManifest(pluginPath, manifest, category);
            }

            // Fallback to convention-based loading
            return await this.loadByConvention(pluginPath, category);
        } catch (error) {
            console.warn(`Failed to load plugin at ${pluginPath}:`, error.message);
        }
    }

    static async loadFromManifest(pluginPath, manifest, category) {
        const effectModule = await import(`${pluginPath}/${manifest.files.effect}`);
        const effectClass = effectModule[manifest.files.exports.effect];

        let configClass = null;
        if (manifest.files.config) {
            const configModule = await import(`${pluginPath}/${manifest.files.config}`);
            configClass = configModule[manifest.files.exports.config];
        }

        this.register({
            name: manifest.name,
            category,
            effectClass,
            configClass,
            metadata: manifest
        });
    }

    static async loadByConvention(pluginPath, category) {
        // Convention: directory name matches effect file pattern
        const dirName = pluginPath.split('/').pop();

        // Try multiple naming patterns
        const possibleEffectFiles = [
            `${this.toPascalCase(dirName)}Effect.js`,
            `${dirName}Effect.js`,
            `${dirName}.js`
        ];

        for (const filename of possibleEffectFiles) {
            try {
                const effectModule = await import(`${pluginPath}/${filename}`);
                const effectClass = Object.values(effectModule).find(
                    exp => exp?._name_ && typeof exp === 'function'
                );

                if (effectClass) {
                    // Try to find corresponding config
                    const configClass = await this.findConfigForEffect(pluginPath, effectClass);

                    this.register({
                        name: effectClass._name_,
                        category,
                        effectClass,
                        configClass,
                        metadata: effectClass._metadata_ || {}
                    });
                    return;
                }
            } catch (e) {
                // Continue to next pattern
            }
        }
    }
}

// ========================================
// APPROACH 4: Plugin Interface with Validation
// ========================================

export class Plugin {
    constructor(definition) {
        this.validateDefinition(definition);
        Object.assign(this, definition);
    }

    validateDefinition(def) {
        const required = ['name', 'category', 'effectClass'];
        const missing = required.filter(field => !def[field]);

        if (missing.length > 0) {
            throw new Error(`Plugin missing required fields: ${missing.join(', ')}`);
        }

        if (!def.effectClass._name_) {
            throw new Error('Effect class must have static _name_ property');
        }

        if (def.configClass && typeof def.configClass !== 'function') {
            throw new Error('Config class must be a constructor function');
        }
    }

    async register(registry) {
        // Register effect
        registry.registerEffect(this.effectClass, this.category, this.metadata);

        // Register config if present
        if (this.configClass) {
            registry.registerConfig(this.name, this.configClass, this.metadata);
        }

        console.log(`✓ Registered plugin: ${this.name}`);
    }
}

// ========================================
// APPROACH 5: Factory Pattern with Auto-Discovery
// ========================================

export class EffectFactory {
    static effects = new Map();
    static configs = new Map();

    static async loadEffectsFromPackage(packageName = 'effects') {
        try {
            // Import the package's main registration function
            const { register, getAllEffects } = await import(`${packageName}`);

            // Use package's own registration system
            const mockRegistry = {
                register: (effectClass, category) => {
                    this.effects.set(effectClass._name_, {
                        effectClass,
                        category,
                        configClass: effectClass._configClass_ || null
                    });
                }
            };

            await register(mockRegistry);

            // Validate all loaded effects
            for (const [name, plugin] of this.effects) {
                await this.validatePlugin(name, plugin);
            }

            console.log(`✓ Loaded ${this.effects.size} effects from ${packageName}`);
        } catch (error) {
            throw new Error(`Failed to load effects package: ${error.message}`);
        }
    }

    static async validatePlugin(name, plugin) {
        const { effectClass, configClass } = plugin;

        // Validate effect class
        if (!effectClass._name_) {
            throw new Error(`Effect ${name} missing _name_ property`);
        }

        if (typeof effectClass.prototype.invoke !== 'function') {
            throw new Error(`Effect ${name} missing invoke method`);
        }

        // Validate config class if present
        if (configClass) {
            try {
                new configClass({}); // Test instantiation
                this.configs.set(name, configClass);
            } catch (error) {
                console.warn(`Config for ${name} failed validation:`, error.message);
            }
        }
    }
}
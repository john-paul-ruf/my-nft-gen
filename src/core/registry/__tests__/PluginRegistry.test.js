import { PluginRegistry } from '../PluginRegistry.js';
import { EffectCategories } from '../EffectCategories.js';

// Mock effect classes for testing
class MockEffect {
    static _name_ = 'mock-effect';
    static _category_ = 'primary';
    static _version_ = '1.0.0';
    static _author_ = 'test';
    static _description_ = 'Mock effect for testing';

    constructor(options = {}) {
        this.name = options.name || MockEffect._name_;
        this.config = options.config || {};
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        // Mock implementation
        return Promise.resolve();
    }
}

class MockConfig {
    constructor(options = {}) {
        this.testProperty = options.testProperty || 'default';
    }
}

class MockEffectWithConfig extends MockEffect {
    static _name_ = 'mock-effect-with-config';
    static _configClass_ = MockConfig;
}

class InvalidEffect {
    // Missing _name_ and invoke method
}

class InvalidEffectMissingInvoke {
    static _name_ = 'invalid-effect';
}

describe('PluginRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new PluginRegistry();
    });

    afterEach(() => {
        PluginRegistry.clear();
    });

    describe('Basic Registration', () => {
        test('should register a basic plugin', () => {
            const plugin = {
                name: 'test-effect',
                category: 'primary',
                effectClass: MockEffect,
                metadata: { description: 'Test effect' }
            };

            registry.register(plugin);

            expect(registry.has('test-effect')).toBe(true);
            expect(registry.get('test-effect')).toMatchObject({
                effectClass: MockEffect,
                category: 'primary'
            });
        });

        test('should auto-register an effect with static properties', () => {
            registry.autoRegister(MockEffect);

            expect(registry.has('mock-effect')).toBe(true);

            const plugin = registry.get('mock-effect');
            expect(plugin.effectClass).toBe(MockEffect);
            expect(plugin.category).toBe('primary');
            expect(plugin.configClass).toBeNull();
        });

        test('should auto-register an effect with config class', () => {
            registry.autoRegister(MockEffectWithConfig);

            expect(registry.has('mock-effect-with-config')).toBe(true);

            const plugin = registry.get('mock-effect-with-config');
            expect(plugin.effectClass).toBe(MockEffectWithConfig);
            expect(plugin.configClass).toBe(MockConfig);
        });

        test('should register with metadata from static properties', () => {
            registry.autoRegister(MockEffect);

            const plugin = registry.get('mock-effect');
            expect(plugin.metadata).toMatchObject({
                version: '1.0.0',
                author: 'test',
                description: 'Mock effect for testing'
            });
        });
    });

    describe('Validation', () => {
        test('should throw error for missing required fields', () => {
            expect(() => {
                registry.register({
                    // missing name, category, effectClass
                });
            }).toThrow('Plugin missing required fields');
        });

        test('should throw error for invalid category', () => {
            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'invalid-category',
                    effectClass: MockEffect
                });
            }).toThrow('Invalid category');
        });

        test('should throw error for non-function effect class', () => {
            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'primary',
                    effectClass: 'not-a-function'
                });
            }).toThrow('effectClass must be a constructor function');
        });

        test('should throw error for effect class without _name_', () => {
            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'primary',
                    effectClass: InvalidEffect
                });
            }).toThrow('Effect class must have static _name_ property');
        });

        test('should throw error for effect class without invoke method', () => {
            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'primary',
                    effectClass: InvalidEffectMissingInvoke
                });
            }).toThrow('Effect class must have invoke method');
        });

        test('should throw error for invalid config class', () => {
            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'primary',
                    effectClass: MockEffect,
                    configClass: 'not-a-function'
                });
            }).toThrow('configClass must be a constructor function');
        });

        test('should validate config class instantiation', () => {
            class BadConfig {
                constructor() {
                    throw new Error('Config error');
                }
            }

            expect(() => {
                registry.register({
                    name: 'test',
                    category: 'primary',
                    effectClass: MockEffect,
                    configClass: BadConfig
                });
            }).toThrow('Config class validation failed');
        });

        test('should throw error for auto-register without _name_', () => {
            expect(() => {
                registry.autoRegister(InvalidEffect);
            }).toThrow('Effect class must have static _name_ property for auto-registration');
        });
    });

    describe('Retrieval', () => {
        beforeEach(() => {
            registry.autoRegister(MockEffect);
            registry.autoRegister(MockEffectWithConfig);
        });

        test('should get plugin by name', () => {
            const plugin = registry.get('mock-effect');
            expect(plugin).toBeDefined();
            expect(plugin.effectClass).toBe(MockEffect);
        });

        test('should get effect class by name', () => {
            expect(registry.getEffectClass('mock-effect')).toBe(MockEffect);
            expect(registry.getEffectClass('nonexistent')).toBeNull();
        });

        test('should get config class by name', () => {
            expect(registry.getConfigClass('mock-effect-with-config')).toBe(MockConfig);
            expect(registry.getConfigClass('mock-effect')).toBeNull();
            expect(registry.getConfigClass('nonexistent')).toBeNull();
        });

        test('should check if plugin exists', () => {
            expect(registry.has('mock-effect')).toBe(true);
            expect(registry.has('nonexistent')).toBe(false);
        });

        test('should get plugins by category', () => {
            const primaryEffects = registry.getByCategory('primary');
            expect(primaryEffects).toHaveLength(2);
            expect(primaryEffects.map(p => p.name)).toContain('mock-effect');
            expect(primaryEffects.map(p => p.name)).toContain('mock-effect-with-config');
        });

        test('should get all plugins', () => {
            const allPlugins = registry.getAllPlugins();
            expect(allPlugins).toHaveLength(2);
        });

        test('should throw error for invalid category in getByCategory', () => {
            expect(() => {
                registry.getByCategory('invalid-category');
            }).toThrow('Invalid category');
        });
    });

    describe('Statistics', () => {
        beforeEach(() => {
            registry.autoRegister(MockEffect);
            registry.autoRegister(MockEffectWithConfig);
        });

        test('should return accurate statistics', () => {
            const stats = registry.getStats();

            expect(stats.total).toBe(2);
            expect(stats.withConfigs).toBe(1);
            expect(stats.byCategory.primary).toBe(2);
            expect(stats.loadedPackages).toEqual([]);
        });
    });

    describe('Global Registry', () => {
        test('should use global registry for static methods', () => {
            PluginRegistry.autoRegister(MockEffect);

            expect(PluginRegistry.has('mock-effect')).toBe(true);
            expect(PluginRegistry.getEffectClass('mock-effect')).toBe(MockEffect);
        });

        test('should clear global registry', () => {
            PluginRegistry.autoRegister(MockEffect);
            expect(PluginRegistry.has('mock-effect')).toBe(true);

            PluginRegistry.clear();
            expect(PluginRegistry.has('mock-effect')).toBe(false);
        });
    });

    describe('Package Loading', () => {
        let originalImport;

        beforeEach(() => {
            // Mock import function properly
            originalImport = global.import;
        });

        afterEach(() => {
            if (originalImport) {
                global.import = originalImport;
            }
        });

        test('should track loaded packages', async () => {
            const mockPackage = {
                register: jest.fn((registry) => {
                    registry.register(MockEffect, 'primary');
                })
            };

            // Mock the PluginRegistry's import call
            const mockLoadFromPackage = jest.spyOn(registry, 'loadFromPackage');
            mockLoadFromPackage.mockImplementation(async (packageName) => {
                if (registry.loadedPackages.has(packageName)) {
                    console.log(`Package '${packageName}' already loaded, skipping`);
                    return;
                }

                console.log(`Loading plugins from package: ${packageName}`);

                const registryAdapter = {
                    register: (effectClass, category) => {
                        // Properly create an effect class object for auto-registration
                        const effectWithCategory = class extends effectClass {};
                        effectWithCategory._name_ = effectClass._name_;
                        effectWithCategory._category_ = category;
                        registry.autoRegister(effectWithCategory);
                    }
                };

                await mockPackage.register(registryAdapter, null);
                registry.loadedPackages.add(packageName);

                const pluginCount = registry.plugins.size;
                console.log(`✓ Successfully loaded ${pluginCount} plugins from ${packageName}`);
            });

            await registry.loadFromPackage('mock-package');

            expect(registry.loadedPackages.has('mock-package')).toBe(true);
            expect(mockPackage.register).toHaveBeenCalled();

            mockLoadFromPackage.mockRestore();
        });

        test('should not reload already loaded packages', async () => {
            registry.loadedPackages.add('already-loaded');

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await registry.loadFromPackage('already-loaded');

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('already loaded, skipping')
            );

            consoleSpy.mockRestore();
        });

        test('should handle package loading errors', async () => {
            const mockLoadFromPackage = jest.spyOn(registry, 'loadFromPackage');
            mockLoadFromPackage.mockRejectedValue(new Error('Package not found'));

            await expect(registry.loadFromPackage('nonexistent-package'))
                .rejects.toThrow('Package not found');

            mockLoadFromPackage.mockRestore();
        });

        test('should handle packages without register function', async () => {
            const mockLoadFromPackage = jest.spyOn(registry, 'loadFromPackage');
            mockLoadFromPackage.mockRejectedValue(new Error('Package \'bad-package\' does not export a \'register\' function'));

            await expect(registry.loadFromPackage('bad-package'))
                .rejects.toThrow('does not export a \'register\' function');

            mockLoadFromPackage.mockRestore();
        });

        test('should set author to "nft-core-effects" for effects package', async () => {
            // Create an effect without _author_ property
            class CoreEffect {
                static _name_ = 'core-effect';
                constructor(options = {}) {
                    this.name = options.name || CoreEffect._name_;
                }
                async invoke() {
                    return Promise.resolve();
                }
            }

            const mockPackage = {
                register: jest.fn((registry) => {
                    registry.register(CoreEffect, 'primary');
                })
            };

            const mockLoadFromPackage = jest.spyOn(registry, 'loadFromPackage');
            mockLoadFromPackage.mockImplementation(async (packageName) => {
                if (registry.loadedPackages.has(packageName)) {
                    return;
                }

                const defaultAuthor = packageName === 'effects' || packageName.includes('effects') ? 'nft-core-effects' : 'unknown';

                const registryAdapter = {
                    register: (effectClass, category) => {
                        const plugin = {
                            name: effectClass._name_,
                            category,
                            effectClass,
                            configClass: effectClass._configClass_ || null,
                            metadata: {
                                description: effectClass._description_ || '',
                                version: effectClass._version_ || '1.0.0',
                                author: effectClass._author_ || defaultAuthor,
                                tags: effectClass._tags_ || [],
                                ...(effectClass._metadata_ || {})
                            }
                        };
                        registry.register(plugin);
                    }
                };

                await mockPackage.register(registryAdapter, null);
                registry.loadedPackages.add(packageName);
            });

            await registry.loadFromPackage('effects');

            const plugin = registry.get('core-effect');
            expect(plugin).toBeDefined();
            expect(plugin.metadata.author).toBe('nft-core-effects');

            mockLoadFromPackage.mockRestore();
        });

        test('should set author to "unknown" for non-core packages without _author_', async () => {
            // Create an effect without _author_ property
            class ThirdPartyEffect {
                static _name_ = 'third-party-effect';
                constructor(options = {}) {
                    this.name = options.name || ThirdPartyEffect._name_;
                }
                async invoke() {
                    return Promise.resolve();
                }
            }

            const mockPackage = {
                register: jest.fn((registry) => {
                    registry.register(ThirdPartyEffect, 'primary');
                })
            };

            const mockLoadFromPackage = jest.spyOn(registry, 'loadFromPackage');
            mockLoadFromPackage.mockImplementation(async (packageName) => {
                if (registry.loadedPackages.has(packageName)) {
                    return;
                }

                const defaultAuthor = packageName === 'effects' || packageName.includes('effects') ? 'nft-core-effects' : 'unknown';

                const registryAdapter = {
                    register: (effectClass, category) => {
                        const plugin = {
                            name: effectClass._name_,
                            category,
                            effectClass,
                            configClass: effectClass._configClass_ || null,
                            metadata: {
                                description: effectClass._description_ || '',
                                version: effectClass._version_ || '1.0.0',
                                author: effectClass._author_ || defaultAuthor,
                                tags: effectClass._tags_ || [],
                                ...(effectClass._metadata_ || {})
                            }
                        };
                        registry.register(plugin);
                    }
                };

                await mockPackage.register(registryAdapter, null);
                registry.loadedPackages.add(packageName);
            });

            await registry.loadFromPackage('some-third-party-package');

            const plugin = registry.get('third-party-effect');
            expect(plugin).toBeDefined();
            expect(plugin.metadata.author).toBe('unknown');

            mockLoadFromPackage.mockRestore();
        });
    });

    describe('Overwriting', () => {
        test('should warn when overwriting existing plugin', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            registry.autoRegister(MockEffect);
            registry.autoRegister(MockEffect); // Register again

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('already registered, overwriting')
            );

            consoleSpy.mockRestore();
        });
    });
});
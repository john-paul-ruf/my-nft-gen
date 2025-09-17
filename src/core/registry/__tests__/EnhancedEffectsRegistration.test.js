import { EnhancedEffectsRegistration } from '../EnhancedEffectsRegistration.js';
import { PluginRegistry } from '../PluginRegistry.js';
import { EffectRegistry } from '../EffectRegistry.js';
import { ConfigRegistry } from '../ConfigRegistry.js';

// Mock config class (defined first to avoid hoisting issues)
class TestConfig {
    constructor(options = {}) {
        this.value = options.value || 'default';
    }
}

// Mock effect classes
class TestEffect {
    static _name_ = 'test-effect';
    static _category_ = 'primary';
    static _configClass_ = TestConfig;
    static _version_ = '2.0.0';
    static _author_ = 'test-team';

    constructor(options = {}) {
        this.name = options.name || TestEffect._name_;
        this.config = options.config || {};
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        return Promise.resolve();
    }
}

class EffectWithoutConfig {
    static _name_ = 'no-config-effect';
    static _category_ = 'secondary';

    constructor(options = {}) {
        this.name = options.name || EffectWithoutConfig._name_;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        return Promise.resolve();
    }
}

class ProblematicEffect {
    static _name_ = 'problematic-effect';

    constructor(options = {}) {
        throw new Error('Intentional error');
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        return Promise.resolve();
    }
}

describe('EnhancedEffectsRegistration', () => {
    let consoleLogSpy;
    let consoleWarnSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        // Clear all registries
        PluginRegistry.clear();
        EffectRegistry.clearGlobal();
        ConfigRegistry.clearGlobal();

        // Mock console methods
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        // Restore console methods
        consoleLogSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('Package Registration', () => {
        test('should register effects from package successfully', async () => {
            // Mock the loadFromPackage method
            const mockLoadFromPackage = jest.spyOn(PluginRegistry, 'loadFromPackage');
            mockLoadFromPackage.mockImplementation(async (packageName) => {
                // Simulate package loading
                PluginRegistry.autoRegister(TestEffect);
                PluginRegistry.autoRegister(EffectWithoutConfig);
                PluginRegistry.globalRegistry.loadedPackages.add(packageName);
            });

            try {
                const stats = await EnhancedEffectsRegistration.registerEffectsFromPackage('test-package');

                expect(stats.total).toBe(2);
                expect(stats.withConfigs).toBe(1);
                expect(stats.byCategory.primary).toBe(1);
                expect(stats.byCategory.secondary).toBe(1);

                // Verify plugin registry
                expect(PluginRegistry.has('test-effect')).toBe(true);
                expect(PluginRegistry.has('no-config-effect')).toBe(true);

                // Verify legacy registries were populated
                expect(EffectRegistry.hasGlobal('test-effect')).toBe(true);
                expect(EffectRegistry.hasGlobal('no-config-effect')).toBe(true);
                expect(ConfigRegistry.hasGlobal('test-effect')).toBe(true);
                expect(ConfigRegistry.hasGlobal('no-config-effect')).toBe(false);

            } finally {
                mockLoadFromPackage.mockRestore();
            }
        });

        test('should handle package registration errors', async () => {
            const mockLoadFromPackage = jest.spyOn(PluginRegistry, 'loadFromPackage');
            mockLoadFromPackage.mockRejectedValue(new Error('Package not found'));

            await expect(
                EnhancedEffectsRegistration.registerEffectsFromPackage('nonexistent-package')
            ).rejects.toThrow('Package not found');

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to register effects:',
                'Package not found'
            );

            mockLoadFromPackage.mockRestore();
        });

        test('should clear existing registrations before loading', async () => {
            // Pre-populate registries
            PluginRegistry.autoRegister(TestEffect);

            const mockLoadFromPackage = jest.spyOn(PluginRegistry, 'loadFromPackage');
            mockLoadFromPackage.mockImplementation(async (packageName) => {
                // Simulate loading only one effect
                PluginRegistry.autoRegister(EffectWithoutConfig);
                PluginRegistry.globalRegistry.loadedPackages.add(packageName);
            });

            await EnhancedEffectsRegistration.registerEffectsFromPackage('test-package');

            // Should only have the effect from the package, not the pre-existing one
            expect(PluginRegistry.has('test-effect')).toBe(false);
            expect(PluginRegistry.has('no-config-effect')).toBe(true);

            mockLoadFromPackage.mockRestore();
        });
    });

    describe('Legacy Registry Migration', () => {
        beforeEach(() => {
            PluginRegistry.autoRegister(TestEffect);
            PluginRegistry.autoRegister(EffectWithoutConfig);
        });

        test('should migrate plugins to legacy registries', async () => {
            await EnhancedEffectsRegistration.migrateTeLegacyRegistries();

            // Check EffectRegistry
            expect(EffectRegistry.hasGlobal('test-effect')).toBe(true);
            expect(EffectRegistry.hasGlobal('no-config-effect')).toBe(true);

            // Check ConfigRegistry
            expect(ConfigRegistry.hasGlobal('test-effect')).toBe(true);
            expect(ConfigRegistry.hasGlobal('no-config-effect')).toBe(false);

            // Verify effect class is correct
            expect(EffectRegistry.getGlobal('test-effect')).toBe(TestEffect);

            // Verify config class is correct
            expect(ConfigRegistry.getConfigClassGlobal('test-effect')).toBe(TestConfig);
        });

        test('should handle migration errors gracefully', async () => {
            // Mock EffectRegistry to throw error
            const originalRegister = EffectRegistry.registerGlobal;
            EffectRegistry.registerGlobal = jest.fn().mockImplementation(() => {
                throw new Error('Registry error');
            });

            try {
                await EnhancedEffectsRegistration.migrateTeLegacyRegistries();

                expect(consoleWarnSpy).toHaveBeenCalledWith(
                    expect.stringContaining('Failed to migrate plugin'),
                    expect.any(String)
                );
            } finally {
                EffectRegistry.registerGlobal = originalRegister;
            }
        });
    });

    describe('Single Effect Registration', () => {
        test('should register single effect', () => {
            EnhancedEffectsRegistration.registerEffect(TestEffect, 'primary', {
                description: 'Custom description'
            });

            expect(PluginRegistry.has('test-effect')).toBe(true);

            const plugin = PluginRegistry.get('test-effect');
            expect(plugin.effectClass).toBe(TestEffect);
            expect(plugin.category).toBe('primary');
            expect(plugin.metadata.description).toBe('Custom description');
        });

        test('should register effect with config class from static property', () => {
            EnhancedEffectsRegistration.registerEffect(TestEffect, 'primary');

            const plugin = PluginRegistry.get('test-effect');
            expect(plugin.configClass).toBe(TestConfig);
        });
    });

    describe('Registration Report', () => {
        beforeEach(async () => {
            PluginRegistry.autoRegister(TestEffect);
            PluginRegistry.autoRegister(EffectWithoutConfig);
            await EnhancedEffectsRegistration.migrateTeLegacyRegistries();
        });

        test('should generate comprehensive registration report', () => {
            const report = EnhancedEffectsRegistration.getRegistrationReport();

            expect(report.modern.plugins).toBe(2);
            expect(report.modern.withConfigs).toBe(1);
            expect(report.modern.byCategory.primary).toBe(1);
            expect(report.modern.byCategory.secondary).toBe(1);

            expect(report.legacy.effects).toBe(2);
            expect(report.legacy.configs).toBe(1);

            expect(report.discrepancies.missingConfigs).toEqual(['no-config-effect']);
            expect(report.discrepancies.orphanedConfigs).toEqual([]);
        });

        test('should detect orphaned configs', () => {
            // Add an orphaned config
            ConfigRegistry.registerGlobal('orphaned-config', TestConfig);

            const report = EnhancedEffectsRegistration.getRegistrationReport();

            expect(report.discrepancies.orphanedConfigs).toContain('orphaned-config');
        });
    });

    describe('Plugin Validation', () => {
        test('should validate all plugins successfully', () => {
            PluginRegistry.autoRegister(TestEffect);
            PluginRegistry.autoRegister(EffectWithoutConfig);

            const validation = EnhancedEffectsRegistration.validateAllPlugins();

            expect(validation.totalPlugins).toBe(2);
            expect(validation.validPlugins).toBe(2);
            expect(validation.issues).toHaveLength(0);
        });

        test('should detect plugin instantiation errors', () => {
            PluginRegistry.autoRegister(ProblematicEffect);

            const validation = EnhancedEffectsRegistration.validateAllPlugins();

            expect(validation.totalPlugins).toBe(1);
            expect(validation.validPlugins).toBe(0);
            expect(validation.issues).toHaveLength(1);
            expect(validation.issues[0]).toMatchObject({
                plugin: 'problematic-effect',
                type: 'instantiation_error',
                message: expect.stringContaining('Intentional error')
            });
        });

        test('should detect missing invoke method', () => {
            class InvalidEffect {
                static _name_ = 'invalid-effect';

                constructor() {
                    // Missing invoke method
                }
            }

            // Skip registry validation for this test
            PluginRegistry.globalRegistry.plugins.set('invalid-effect', {
                effectClass: InvalidEffect,
                configClass: null,
                category: 'primary',
                metadata: {}
            });

            const validation = EnhancedEffectsRegistration.validateAllPlugins();

            expect(validation.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        plugin: 'invalid-effect',
                        type: 'missing_invoke'
                    })
                ])
            );
        });

        test('should detect config validation errors', () => {
            class BadConfig {
                constructor() {
                    throw new Error('Config validation error');
                }
            }

            class EffectWithBadConfig {
                static _name_ = 'bad-config-effect';

                constructor(options = {}) {
                    // This will try to instantiate BadConfig and fail
                    if (options.config) {
                        this.config = options.config;
                    } else {
                        this.config = new BadConfig({});
                    }
                }

                async invoke() {}
            }

            // Manually add to registry to bypass initial validation
            PluginRegistry.globalRegistry.plugins.set('bad-config-effect', {
                effectClass: EffectWithBadConfig,
                configClass: BadConfig,
                category: 'primary',
                metadata: {}
            });

            const validation = EnhancedEffectsRegistration.validateAllPlugins();

            expect(validation.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        plugin: 'bad-config-effect',
                        type: 'instantiation_error'
                    })
                ])
            );
        });
    });
});
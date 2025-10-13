import { PresetRegistry } from '../../src/core/registry/PresetRegistry.js';

describe('PresetRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new PresetRegistry();
    });

    afterEach(() => {
        PresetRegistry.clearGlobal();
    });

    describe('register', () => {
        it('should register a single preset for an effect', () => {
            const preset = {
                name: 'preset1',
                effect: 'TestEffect',
                percentChance: 100,
                currentEffectConfig: { param: 'value' }
            };

            registry.register('TestEffect', preset);

            expect(registry.has('TestEffect')).toBe(true);
            const presets = registry.get('TestEffect');
            expect(presets).toHaveLength(1);
            expect(presets[0]).toEqual(preset);
        });

        it('should register multiple presets for an effect', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect', percentChance: 100 },
                { name: 'preset2', effect: 'TestEffect', percentChance: 50 }
            ];

            registry.register('TestEffect', presets);

            const registered = registry.get('TestEffect');
            expect(registered).toHaveLength(2);
            expect(registered).toEqual(presets);
        });

        it('should append presets when registering to existing effect', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            registry.register('TestEffect', { name: 'preset2', effect: 'TestEffect' });

            const presets = registry.get('TestEffect');
            expect(presets).toHaveLength(2);
            expect(presets[0].name).toBe('preset1');
            expect(presets[1].name).toBe('preset2');
        });

        it('should store metadata', () => {
            const preset = { name: 'preset1', effect: 'TestEffect' };
            const metadata = {
                description: 'Test presets',
                version: '2.0.0',
                author: 'Test Author'
            };

            registry.register('TestEffect', preset, metadata);

            const meta = registry.getMetadata('TestEffect');
            expect(meta.description).toBe('Test presets');
            expect(meta.version).toBe('2.0.0');
            expect(meta.author).toBe('Test Author');
            expect(meta.presetCount).toBe(1);
        });

        it('should throw error if effect name is missing', () => {
            expect(() => {
                registry.register('', { name: 'preset1', effect: 'Test' });
            }).toThrow('Effect name is required');
        });

        it('should throw error if presets are missing', () => {
            expect(() => {
                registry.register('TestEffect', null);
            }).toThrow('Presets are required');
        });

        it('should throw error if preset is missing name field', () => {
            expect(() => {
                registry.register('TestEffect', { effect: 'TestEffect' });
            }).toThrow("must have a 'name' field");
        });

        it('should throw error if preset is missing effect field', () => {
            expect(() => {
                registry.register('TestEffect', { name: 'preset1' });
            }).toThrow("must have an 'effect' field");
        });
    });

    describe('get', () => {
        it('should return presets for registered effect', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect' }
            ];
            registry.register('TestEffect', presets);

            const result = registry.get('TestEffect');
            expect(result).toEqual(presets);
        });

        it('should return null for unregistered effect', () => {
            expect(registry.get('NonExistent')).toBeNull();
        });
    });

    describe('getPreset', () => {
        it('should return specific preset by name', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect', value: 1 },
                { name: 'preset2', effect: 'TestEffect', value: 2 }
            ];
            registry.register('TestEffect', presets);

            const preset = registry.getPreset('TestEffect', 'preset2');
            expect(preset).toEqual({ name: 'preset2', effect: 'TestEffect', value: 2 });
        });

        it('should return null if effect not found', () => {
            expect(registry.getPreset('NonExistent', 'preset1')).toBeNull();
        });

        it('should return null if preset name not found', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            expect(registry.getPreset('TestEffect', 'nonexistent')).toBeNull();
        });
    });

    describe('has', () => {
        it('should return true for registered effect', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            expect(registry.has('TestEffect')).toBe(true);
        });

        it('should return false for unregistered effect', () => {
            expect(registry.has('NonExistent')).toBe(false);
        });
    });

    describe('getPresetNames', () => {
        it('should return array of preset names', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect' },
                { name: 'preset2', effect: 'TestEffect' },
                { name: 'preset3', effect: 'TestEffect' }
            ];
            registry.register('TestEffect', presets);

            const names = registry.getPresetNames('TestEffect');
            expect(names).toEqual(['preset1', 'preset2', 'preset3']);
        });

        it('should return empty array for unregistered effect', () => {
            expect(registry.getPresetNames('NonExistent')).toEqual([]);
        });
    });

    describe('getAllPresets', () => {
        it('should return all registered presets', () => {
            registry.register('Effect1', { name: 'preset1', effect: 'Effect1' });
            registry.register('Effect2', { name: 'preset2', effect: 'Effect2' });

            const all = registry.getAllPresets();
            expect(all).toHaveLength(2);
            expect(all[0].effectName).toBe('Effect1');
            expect(all[1].effectName).toBe('Effect2');
        });

        it('should return empty array when no presets registered', () => {
            expect(registry.getAllPresets()).toEqual([]);
        });
    });

    describe('unregister', () => {
        it('should remove all presets for an effect', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            expect(registry.has('TestEffect')).toBe(true);

            const result = registry.unregister('TestEffect');
            expect(result).toBe(true);
            expect(registry.has('TestEffect')).toBe(false);
        });

        it('should return false when unregistering non-existent effect', () => {
            expect(registry.unregister('NonExistent')).toBe(false);
        });

        it('should also remove metadata', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            registry.unregister('TestEffect');
            expect(registry.getMetadata('TestEffect')).toBeNull();
        });
    });

    describe('unregisterPreset', () => {
        it('should remove specific preset', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect' },
                { name: 'preset2', effect: 'TestEffect' }
            ];
            registry.register('TestEffect', presets);

            const result = registry.unregisterPreset('TestEffect', 'preset1');
            expect(result).toBe(true);

            const remaining = registry.get('TestEffect');
            expect(remaining).toHaveLength(1);
            expect(remaining[0].name).toBe('preset2');
        });

        it('should remove effect entry when last preset is removed', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            registry.unregisterPreset('TestEffect', 'preset1');

            expect(registry.has('TestEffect')).toBe(false);
        });

        it('should update metadata preset count', () => {
            const presets = [
                { name: 'preset1', effect: 'TestEffect' },
                { name: 'preset2', effect: 'TestEffect' }
            ];
            registry.register('TestEffect', presets);

            registry.unregisterPreset('TestEffect', 'preset1');

            const meta = registry.getMetadata('TestEffect');
            expect(meta.presetCount).toBe(1);
        });

        it('should return false when preset not found', () => {
            registry.register('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            expect(registry.unregisterPreset('TestEffect', 'nonexistent')).toBe(false);
        });
    });

    describe('clear', () => {
        it('should remove all presets', () => {
            registry.register('Effect1', { name: 'preset1', effect: 'Effect1' });
            registry.register('Effect2', { name: 'preset2', effect: 'Effect2' });

            registry.clear();

            expect(registry.size()).toBe(0);
            expect(registry.getAllPresets()).toEqual([]);
        });
    });

    describe('size and totalPresets', () => {
        it('should return number of effects with presets', () => {
            registry.register('Effect1', { name: 'preset1', effect: 'Effect1' });
            registry.register('Effect2', { name: 'preset2', effect: 'Effect2' });

            expect(registry.size()).toBe(2);
        });

        it('should return total number of presets', () => {
            registry.register('Effect1', [
                { name: 'preset1', effect: 'Effect1' },
                { name: 'preset2', effect: 'Effect1' }
            ]);
            registry.register('Effect2', { name: 'preset3', effect: 'Effect2' });

            expect(registry.totalPresets()).toBe(3);
        });
    });

    describe('Global registry', () => {
        it('should register to global registry', () => {
            PresetRegistry.registerGlobal('TestEffect', { name: 'preset1', effect: 'TestEffect' });

            expect(PresetRegistry.hasGlobal('TestEffect')).toBe(true);
            const presets = PresetRegistry.getGlobal('TestEffect');
            expect(presets).toHaveLength(1);
        });

        it('should get preset from global registry', () => {
            PresetRegistry.registerGlobal('TestEffect', [
                { name: 'preset1', effect: 'TestEffect' },
                { name: 'preset2', effect: 'TestEffect' }
            ]);

            const preset = PresetRegistry.getPresetGlobal('TestEffect', 'preset2');
            expect(preset.name).toBe('preset2');
        });

        it('should get preset names from global registry', () => {
            PresetRegistry.registerGlobal('TestEffect', [
                { name: 'preset1', effect: 'TestEffect' },
                { name: 'preset2', effect: 'TestEffect' }
            ]);

            const names = PresetRegistry.getPresetNamesGlobal('TestEffect');
            expect(names).toEqual(['preset1', 'preset2']);
        });

        it('should get all from global registry', () => {
            PresetRegistry.registerGlobal('Effect1', { name: 'preset1', effect: 'Effect1' });
            PresetRegistry.registerGlobal('Effect2', { name: 'preset2', effect: 'Effect2' });

            const all = PresetRegistry.getAllGlobal();
            expect(all).toHaveLength(2);
        });

        it('should clear global registry', () => {
            PresetRegistry.registerGlobal('TestEffect', { name: 'preset1', effect: 'TestEffect' });
            PresetRegistry.clearGlobal();

            expect(PresetRegistry.sizeGlobal()).toBe(0);
        });

        it('should get size and total from global registry', () => {
            PresetRegistry.registerGlobal('Effect1', [
                { name: 'preset1', effect: 'Effect1' },
                { name: 'preset2', effect: 'Effect1' }
            ]);
            PresetRegistry.registerGlobal('Effect2', { name: 'preset3', effect: 'Effect2' });

            expect(PresetRegistry.sizeGlobal()).toBe(2);
            expect(PresetRegistry.totalPresetsGlobal()).toBe(3);
        });
    });
});
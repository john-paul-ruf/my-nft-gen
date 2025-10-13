/**
 * Example: Using PresetRegistry with Effect Registration
 * 
 * This example shows how to:
 * 1. Register effects with presets
 * 2. Look up presets by effect name
 * 3. Query and manage presets in the registry
 */

import { EffectRegistry } from '../src/core/registry/EffectRegistry.js';
import { PresetRegistry } from '../src/core/registry/PresetRegistry.js';
import { LayerEffect } from '../src/core/layer/LayerEffect.js';
import { EffectConfig } from '../src/core/layer/EffectConfig.js';
import { EffectCategories } from '../src/core/registry/EffectCategories.js';

console.log('🎨 PresetRegistry Example\n');

// ============================================================================
// 1. Define an effect class with presets
// ============================================================================

class SpiralWaveEffect extends LayerEffect {
    static _name_ = 'SpiralWave';
    static _description_ = 'Creates spiral wave patterns';
    static _version_ = '1.0.0';
    
    // Define presets for this effect
    static presets = [
        {
            name: 'gentle-spiral',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: {
                spiralCount: 2,
                waveAmplitude: 30,
                rotationSpeed: 1
            }
        },
        {
            name: 'intense-spiral',
            effect: 'SpiralWave',
            percentChance: 100,
            currentEffectConfig: {
                spiralCount: 5,
                waveAmplitude: 80,
                rotationSpeed: 3
            }
        },
        {
            name: 'chaotic-spiral',
            effect: 'SpiralWave',
            percentChance: 80,
            currentEffectConfig: {
                spiralCount: 10,
                waveAmplitude: 120,
                rotationSpeed: 5
            }
        }
    ];
    
    static configClass = class SpiralWaveConfig extends EffectConfig {
        constructor(config = {}) {
            super();
            this.spiralCount = config.spiralCount || 3;
            this.waveAmplitude = config.waveAmplitude || 50;
            this.rotationSpeed = config.rotationSpeed || 2;
        }
    };

    async draw(canvas, context, frameIndex, totalFrames) {
        // Effect implementation would go here
        console.log(`  Drawing SpiralWave: spirals=${this.config.spiralCount}, amplitude=${this.config.waveAmplitude}`);
    }
}

// ============================================================================
// 2. Register the effect (presets are automatically registered)
// ============================================================================

console.log('📦 Registering effect with presets...');
EffectRegistry.registerGlobal(
    SpiralWaveEffect,
    EffectCategories.PRIMARY,
    {
        description: 'Spiral wave effect with multiple presets',
        author: 'Example Author'
    }
);
console.log('✅ Effect registered\n');

// ============================================================================
// 3. Look up presets by effect name
// ============================================================================

console.log('🔍 Looking up presets for SpiralWave:');
const spiralPresets = PresetRegistry.getGlobal('SpiralWave');
console.log(`   Found ${spiralPresets.length} presets:`);
spiralPresets.forEach(preset => {
    console.log(`   - ${preset.name}`);
});
console.log();

// ============================================================================
// 4. Get specific preset
// ============================================================================

console.log('🎯 Getting specific preset:');
const gentlePreset = PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral');
console.log(`   Name: ${gentlePreset.name}`);
console.log(`   Config:`, gentlePreset.currentEffectConfig);
console.log();

// ============================================================================
// 5. Get preset names
// ============================================================================

console.log('📋 Available preset names for SpiralWave:');
const presetNames = PresetRegistry.getPresetNamesGlobal('SpiralWave');
presetNames.forEach(name => console.log(`   - ${name}`));
console.log();

// ============================================================================
// 6. Get metadata
// ============================================================================

console.log('ℹ️  Preset metadata:');
const metadata = PresetRegistry.getMetadataGlobal('SpiralWave');
console.log(`   Effect: ${metadata.effectName}`);
console.log(`   Preset Count: ${metadata.presetCount}`);
console.log(`   Description: ${metadata.description}`);
console.log(`   Version: ${metadata.version}`);
console.log();

// ============================================================================
// 7. Register multiple effects with presets
// ============================================================================

class RadialBurstEffect extends LayerEffect {
    static _name_ = 'RadialBurst';
    static _description_ = 'Creates radial burst patterns';
    
    static presets = [
        {
            name: 'subtle-burst',
            effect: 'RadialBurst',
            percentChance: 100,
            currentEffectConfig: { burstCount: 8, burstLength: 50 }
        },
        {
            name: 'explosive-burst',
            effect: 'RadialBurst',
            percentChance: 100,
            currentEffectConfig: { burstCount: 24, burstLength: 150 }
        }
    ];
    
    static configClass = class RadialBurstConfig extends EffectConfig {
        constructor(config = {}) {
            super();
            this.burstCount = config.burstCount || 12;
            this.burstLength = config.burstLength || 100;
        }
    };

    async draw(canvas, context, frameIndex, totalFrames) {
        console.log(`  Drawing RadialBurst: bursts=${this.config.burstCount}`);
    }
}

console.log('📦 Registering another effect with presets...');
EffectRegistry.registerGlobal(RadialBurstEffect, EffectCategories.PRIMARY);
console.log('✅ RadialBurst registered\n');

// ============================================================================
// 9. Get all presets across all effects
// ============================================================================

console.log('📊 All registered presets:');
const allPresets = PresetRegistry.getAllGlobal();
allPresets.forEach(({ effectName, presets, metadata }) => {
    console.log(`   ${effectName}: ${presets.length} presets`);
    presets.forEach(p => console.log(`      - ${p.name}`));
});
console.log();

// ============================================================================
// 10. Statistics
// ============================================================================

console.log('📈 Registry statistics:');
console.log(`   Effects with presets: ${PresetRegistry.sizeGlobal()}`);
console.log(`   Total presets: ${PresetRegistry.totalPresetsGlobal()}`);
console.log();

// ============================================================================
// 11. Create a combined preset from multiple effects
// ============================================================================

console.log('🎨 Creating combined preset:');
const combinedPreset = [
    PresetRegistry.getPresetGlobal('SpiralWave', 'gentle-spiral'),
    PresetRegistry.getPresetGlobal('RadialBurst', 'explosive-burst')
];

console.log('✅ Combined preset created with presets from multiple effects:');
console.log(`   - ${combinedPreset[0].name} (${combinedPreset[0].effect})`);
console.log(`   - ${combinedPreset[1].name} (${combinedPreset[1].effect})`);
console.log();

// ============================================================================
// Summary
// ============================================================================

console.log('✨ Example complete!\n');
console.log('Key takeaways:');
console.log('1. Define presets as static property on effect class');
console.log('2. Presets are automatically registered when effect is registered');
console.log('3. Look up presets by effect name: PresetRegistry.getGlobal(effectName)');
console.log('4. Get specific preset: PresetRegistry.getPresetGlobal(effectName, presetName)');
console.log('5. Combine presets from multiple effects into one preset');
console.log('6. Use presets to configure your effects programmatically');
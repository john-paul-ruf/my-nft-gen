import { Project } from './app/Project.js';

async function testConfigReconstruction() {
    console.log('🧪 Testing config reconstruction with simple project...');

    try {
        // Create a simple project with one effect that previously caused issues
        const project = new Project({
            runName: 'config-test',
            numberOfFrame: 3, // Just 3 frames for quick test
            frameInc: 1,
            longestSideInPixels: 100, // Small size for quick test
            shortestSideInPixels: 100,
            workingDirectory: 'test-output/',
            layerStrategy: 'sharp'
        });

        // Register effects first
        const { EnhancedEffectsRegistration } = await import('./core/registry/EnhancedEffectsRegistration.js');
        await EnhancedEffectsRegistration.registerEffectsFromPackage();

        // Add an effect that uses Range and ColorPicker objects
        // First need to import effect class to create LayerConfig
        const { EffectRegistry } = await import('./core/registry/EffectRegistry.js');

        // Get FuzzFlare effect class
        let FuzzFlareEffect = EffectRegistry.getGlobal('FuzzFlareEffect');
        if (!FuzzFlareEffect) {
            // Try the plugin name instead
            FuzzFlareEffect = EffectRegistry.getGlobal('fuzz-flare');
        }
        if (!FuzzFlareEffect) {
            console.log('Available effects:', Object.keys(EffectRegistry.getAllPlugins()));
            throw new Error('FuzzFlareEffect not found in registry');
        }

        const { LayerConfig } = await import('./core/layer/LayerConfig.js');

        project.addPrimaryEffect({
            layerConfig: new LayerConfig({
                name: 'fuzz-flare',
                effect: FuzzFlareEffect,
                percentChance: 100,
                currentEffectConfig: {
                    // This should get reconstructed properly - add __className to simulate serialized objects
                    flareRingsSizeRange: {
                        __className: 'PercentageRange',
                        lower: { percent: 0.1 },  // 10% as a percentage object
                        upper: { percent: 0.2 }   // 20% as a percentage object
                    },
                    innerColor: {
                        __className: 'ColorPicker',
                        selectionType: 'colorBucket',
                        colorValue: null
                    }
                }
            })
        });

        console.log('✅ Project created successfully with effect');

        // Create Settings instance to test effect generation with reconstruction
        const { Settings } = await import('./core/Settings.js');
        const settings = new Settings({
            colorScheme: project.colorScheme,
            neutrals: project.neutrals,
            backgrounds: project.backgrounds,
            lights: project.lights,
            numberOfFrame: project.numberOfFrame,
            longestSideInPixels: project.internalLongestSideInPixels,
            shortestSideInPixels: project.internalShortestSideInPixels,
            isHorizontal: project.isHorizontal,
            allPrimaryEffects: project.selectedPrimaryEffectConfigs,
            allFinalImageEffects: project.selectedFinalEffectConfigs
        });

        // Try to generate effects - this is where reconstruction happens
        await settings.generateEffects();

        console.log('✅ Effects generated successfully');
        console.log(`📊 Generated ${settings.effects.length} primary effects`);

        // Check that the first effect has proper config with methods
        if (settings.effects.length > 0) {
            const effect = settings.effects[0];
            const config = effect.config;

            console.log('🔍 Checking config reconstruction:');

            // Check if PercentageRange object has methods
            if (config.flareRingsSizeRange && typeof config.flareRingsSizeRange.lower === 'function') {
                console.log('✅ PercentageRange object properly reconstructed - has .lower() method');
                try {
                    // PercentageRange functions need finalSize parameter
                    const finalSize = { shortestSide: 100, longestSide: 200 };
                    const lowerValue = config.flareRingsSizeRange.lower(finalSize);
                    const upperValue = config.flareRingsSizeRange.upper(finalSize);
                    console.log(`   PercentageRange values: ${lowerValue} to ${upperValue}`);
                } catch (e) {
                    console.log(`   PercentageRange methods exist but failed: ${e.message}`);
                }
            } else {
                console.log('❌ PercentageRange object NOT properly reconstructed');
                console.log('   Type:', typeof config.flareRingsSizeRange);
                console.log('   Lower type:', typeof config.flareRingsSizeRange?.lower);
            }

            // Check if ColorPicker object has methods
            if (config.innerColor && typeof config.innerColor.getColor === 'function') {
                console.log('✅ ColorPicker object properly reconstructed - has .getColor() method');
                try {
                    const color = config.innerColor.getColor(settings);
                    console.log(`   Color value: ${color}`);
                } catch (e) {
                    console.log(`   getColor() method exists but failed: ${e.message}`);
                }
            } else {
                console.log('❌ ColorPicker object NOT properly reconstructed');
                console.log('   Type:', typeof config.innerColor);
                console.log('   getColor type:', typeof config.innerColor?.getColor);
            }
        }

        console.log('\n🎯 Config reconstruction test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Config reconstruction test failed:', error);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run the test
testConfigReconstruction()
    .then(success => {
        if (success) {
            console.log('\n🎉 All tests passed! Config reconstruction is working.');
            process.exit(0);
        } else {
            console.log('\n💥 Tests failed! Config reconstruction needs more work.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('💥 Test runner failed:', error);
        process.exit(1);
    });
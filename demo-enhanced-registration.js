import { EnhancedEffectsRegistration } from './src/core/registry/EnhancedEffectsRegistration.js';
import { PluginRegistry } from './src/core/registry/PluginRegistry.js';

async function demonstrateEnhancedRegistration() {
    console.log('=== Enhanced Plugin Registration System Demo ===\n');

    try {
        // Register effects using the new system
        console.log('1. Loading bundled effects...');
        const stats = await EnhancedEffectsRegistration.registerEffectsFromPackage('effects');

        console.log('\n2. Registration Statistics:');
        console.log(`   Total plugins: ${stats.total}`);
        console.log(`   With configs: ${stats.withConfigs}`);
        console.log('   By category:');
        Object.entries(stats.byCategory).forEach(([category, count]) => {
            console.log(`     ${category}: ${count}`);
        });

        console.log('\n3. Sample Plugin Details:');
        const sampleEffects = ['fuzz-flare', 'hex', 'gates', 'blur', 'glow'];
        for (const effectName of sampleEffects) {
            const plugin = PluginRegistry.get(effectName);
            if (plugin) {
                console.log(`   ✓ ${effectName}:`);
                console.log(`     - Category: ${plugin.category}`);
                console.log(`     - Has Config: ${plugin.configClass ? 'Yes' : 'No'}`);
                console.log(`     - Version: ${plugin.metadata.version || 'Unknown'}`);
            } else {
                console.log(`   ⚠ ${effectName}: Not found`);
            }
        }

        console.log('\n4. Plugin Validation:');
        const validation = EnhancedEffectsRegistration.validateAllPlugins();
        console.log(`   Total plugins validated: ${validation.totalPlugins}`);
        console.log(`   Valid plugins: ${validation.validPlugins}`);
        console.log(`   Issues found: ${validation.issues.length}`);

        if (validation.issues.length > 0) {
            console.log('\n   Issues:');
            validation.issues.slice(0, 5).forEach(issue => {
                console.log(`     - ${issue.plugin}: ${issue.type} - ${issue.message}`);
            });
            if (validation.issues.length > 5) {
                console.log(`     ... and ${validation.issues.length - 5} more`);
            }
        }

        console.log('\n5. Registration Report:');
        const report = EnhancedEffectsRegistration.getRegistrationReport();
        console.log(`   Modern registry: ${report.modern.plugins} plugins, ${report.modern.withConfigs} with configs`);
        console.log(`   Legacy registry: ${report.legacy.effects} effects, ${report.legacy.configs} configs`);
        console.log(`   Missing configs: ${report.discrepancies.missingConfigs.length}`);
        console.log(`   Orphaned configs: ${report.discrepancies.orphanedConfigs.length}`);

        if (report.discrepancies.missingConfigs.length > 0) {
            console.log('\n   Effects without configs:');
            report.discrepancies.missingConfigs.slice(0, 10).forEach(name => {
                console.log(`     - ${name}`);
            });
            if (report.discrepancies.missingConfigs.length > 10) {
                console.log(`     ... and ${report.discrepancies.missingConfigs.length - 10} more`);
            }
        }

        console.log('\n6. Performance Comparison:');
        const start = Date.now();

        // Test retrieval performance
        const testEffects = ['fuzz-flare', 'hex', 'gates', 'blur', 'glow', 'fade'];
        for (let i = 0; i < 1000; i++) {
            for (const effectName of testEffects) {
                PluginRegistry.getEffectClass(effectName);
                PluginRegistry.getConfigClass(effectName);
            }
        }

        const end = Date.now();
        console.log(`   1000 iterations of 6 effect/config lookups: ${end - start}ms`);

        console.log('\n✓ Enhanced registration system demonstration complete!');

    } catch (error) {
        console.error('\n❌ Demo failed:', error.message);
        console.error(error.stack);
    }
}

// Run the demonstration
demonstrateEnhancedRegistration().catch(console.error);
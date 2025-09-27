#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import { PluginManager } from '../core/plugins/PluginManager.js';
import { EffectRegistry } from '../core/registry/EffectRegistry.js';
import { PluginLoader } from '../core/plugins/PluginLoader.js';

const program = new Command();

program
    .name('nft-gen-plugins')
    .description('Plugin management for my-nft-gen')
    .version('1.0.0');

program
    .command('list')
    .description('List all available effects (core + plugins)')
    .action(async () => {
        try {
            // Load core effects
            await PluginLoader.ensureEffectsLoaded();

            // Get all effects
            const effects = await PluginManager.getAllAvailableEffects();

            console.log('\n📦 Available Effects:\n');
            console.log('Primary Effects:', effects.primary.join(', ') || 'None');
            console.log('Secondary Effects:', effects.secondary.join(', ') || 'None');
            console.log('KeyFrame Effects:', effects.keyFrame.join(', ') || 'None');
            console.log('Final Image Effects:', effects.finalImage.join(', ') || 'None');
            console.log('\n✅ Total:',
                effects.primary.length +
                effects.secondary.length +
                effects.keyFrame.length +
                effects.finalImage.length,
                'effects available\n'
            );
        } catch (error) {
            console.error('❌ Failed to list effects:', error.message);
            process.exit(1);
        }
    });

program
    .command('load <path>')
    .description('Load a plugin from path')
    .action(async (pluginPath) => {
        try {
            // Resolve path
            const resolvedPath = path.resolve(pluginPath);

            console.log(`🔄 Loading plugin from ${resolvedPath}...`);

            // Load the plugin
            await PluginManager.loadPlugin(resolvedPath);

            console.log('✅ Plugin loaded successfully!');

            // Show newly available effects
            const effects = await PluginManager.getAllAvailableEffects();
            const totalEffects =
                effects.primary.length +
                effects.secondary.length +
                effects.keyFrame.length +
                effects.finalImage.length;

            console.log(`📊 ${totalEffects} effects now available`);
        } catch (error) {
            console.error('❌ Failed to load plugin:', error.message);
            process.exit(1);
        }
    });

program
    .command('validate <path>')
    .description('Validate a plugin without loading it')
    .action(async (pluginPath) => {
        try {
            const resolvedPath = path.resolve(pluginPath);

            console.log(`🔍 Validating plugin at ${resolvedPath}...`);

            // Check if path exists
            await fs.access(resolvedPath);

            const stats = await fs.stat(resolvedPath);

            if (stats.isDirectory()) {
                // Check for entry points
                const possibleFiles = ['plugin.js', 'index.js', 'main.js'];
                let found = false;

                for (const file of possibleFiles) {
                    try {
                        await fs.access(path.join(resolvedPath, file));
                        console.log(`✅ Found entry point: ${file}`);
                        found = true;
                        break;
                    } catch (e) {
                        // Continue
                    }
                }

                if (!found) {
                    // Check package.json
                    try {
                        const packageJson = JSON.parse(
                            await fs.readFile(path.join(resolvedPath, 'package.json'), 'utf8')
                        );
                        if (packageJson.main) {
                            console.log(`✅ Found entry point in package.json: ${packageJson.main}`);
                            found = true;
                        }
                    } catch (e) {
                        // No package.json
                    }
                }

                if (!found) {
                    console.log('❌ No valid entry point found');
                    process.exit(1);
                }
            } else if (stats.isFile() && pluginPath.endsWith('.js')) {
                console.log('✅ Valid JavaScript file');
            } else {
                console.log('❌ Not a valid plugin format');
                process.exit(1);
            }

            console.log('\n✅ Plugin structure is valid');
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
            process.exit(1);
        }
    });

program
    .command('test <path>')
    .description('Test load a plugin and show what effects it provides')
    .action(async (pluginPath) => {
        try {
            const resolvedPath = path.resolve(pluginPath);

            // Get effects before loading
            await PluginLoader.ensureEffectsLoaded();
            const before = await PluginManager.getAllAvailableEffects();
            const beforeTotal =
                before.primary.length +
                before.secondary.length +
                before.keyFrame.length +
                before.finalImage.length;

            console.log(`📊 Before: ${beforeTotal} effects available`);
            console.log(`🔄 Loading plugin from ${resolvedPath}...`);

            // Load the plugin
            await PluginManager.loadPlugin(resolvedPath);

            // Get effects after loading
            const after = await PluginManager.getAllAvailableEffects();
            const afterTotal =
                after.primary.length +
                after.secondary.length +
                after.keyFrame.length +
                after.finalImage.length;

            console.log(`📊 After: ${afterTotal} effects available`);

            // Show new effects
            const newEffects = {
                primary: after.primary.filter(e => !before.primary.includes(e)),
                secondary: after.secondary.filter(e => !before.secondary.includes(e)),
                keyFrame: after.keyFrame.filter(e => !before.keyFrame.includes(e)),
                finalImage: after.finalImage.filter(e => !before.finalImage.includes(e))
            };

            console.log('\n🆕 New effects added by this plugin:');
            if (newEffects.primary.length > 0) {
                console.log('  Primary:', newEffects.primary.join(', '));
            }
            if (newEffects.secondary.length > 0) {
                console.log('  Secondary:', newEffects.secondary.join(', '));
            }
            if (newEffects.keyFrame.length > 0) {
                console.log('  KeyFrame:', newEffects.keyFrame.join(', '));
            }
            if (newEffects.finalImage.length > 0) {
                console.log('  Final Image:', newEffects.finalImage.join(', '));
            }

            const totalNew =
                newEffects.primary.length +
                newEffects.secondary.length +
                newEffects.keyFrame.length +
                newEffects.finalImage.length;

            if (totalNew === 0) {
                console.log('  (No new effects - plugin may have loaded effects that already exist)');
            }

            console.log(`\n✅ Plugin test complete: ${totalNew} new effects`);
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            process.exit(1);
        }
    });

program.parse(process.argv);
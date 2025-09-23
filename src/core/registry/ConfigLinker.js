import { PluginRegistry } from './PluginRegistry.js';

// Effect-to-Config mapping for my-nft-effects-core package
const EFFECT_CONFIG_MAPPING = {
    // Primary Effects
    'amp': 'AmpConfig',
    'blink-on-blink-on-blink-redux': 'BlinkOnConfig',
    'curved-red-eye': 'CurvedRedEyeConfig',
    'encircled-spiral-round-2': 'EncircledSpiralConfig',
    'fuzz-flare': 'FuzzFlareConfig',
    'fuzz-bands-mark-two': 'FuzzyBandConfig',
    'fuzzy-ripples': 'FuzzyRipplesConfig',
    'gates': 'GatesConfig',
    'hex': 'HexConfig',
    'image-overlay': 'ImageOverlayConfig',
    'layered-hex-now-with-fuzz': 'LayeredHexConfig',
    'layered-rings': 'LayeredRingConfig',
    'upgraded-lens-flare': 'LensFlareConfig',
    'mapped-frames': 'MappedFramesConfig',
    'nth-rings': 'NthRingsConfig',
    'porous.png': 'PorousConfig',
    'ray-rings': 'RayRingConfig',
    'ray-rings (inverted)': 'RayRingInvertedConfig',
    'red-eye': 'RedEyeConfig',
    'rolling-gradient': 'RollingGradientConfig',
    'scan lines': 'ScanLinesConfig',
    'scopes': 'ScopesConfig',
    'static-path': 'StaticPathConfig',
    'viewport': 'ViewportConfig',

    // Secondary Effects
    'edge-glow': 'EdgeGlowConfig',
    'fade': 'FadeConfig',
    'glow': 'GlowConfig',
    'randomize': 'RandomizeConfig',
    'single-layer-blur': 'SingleLayerBlurConfig',
    'single-layer-glitch-drumroll-horizontal-wave': 'SingleLayerGlitchDrumrollHorizontalWaveConfig',
    'single-layer-glitch-fractal': 'SingleLayerGlitchFractalConfig',

    // Final Image Effects
    'bloom-film-grain': 'BloomFilmGrainConfig',
    'blur': 'BlurConfig',
    'claude-crt-barrel-roll': 'ClaudeCRTBarrelRollConfig',
    'colorPulse': 'ColorPulseConfig',
    'crt-barrel': 'CRTBarrelConfig',
    'crt-scan-lines': 'CRTScanLinesConfig',
    'crt-shadow': 'CRTShadowConfig',
    'glitch-drumroll-horizontal-wave': 'GlitchDrumrollHorizontalWaveConfig',
    'glitch-fractal': 'GlitchFractalConfig',
    'glitch-inverse': 'GlitchInverseConfig',
    'modulate': 'ModulateConfig',
    'pixelate': 'PixelateConfig',
    'vintage-fade': 'VintageFadeConfig',

    // Key Frame Effects
    'blur-event': 'BlurKeyFrameConfig',
    'crt-degauss-event': 'CRTDegaussConfig',
    'fade-event': 'FadeKeyFrameConfig',
    'glow-event': 'GlowKeyFrameConfig',
    'pixelate-event': 'PixelateKeyFrameConfig',
    'set-opacity-event': 'SetOpacityKeyFrameConfig',
    'static-image': 'StaticImageKeyFrameConfig'
};

/**
 * Links effects with their config classes by modifying the registration
 */
export class ConfigLinker {

    /**
     * Link effects with config classes by importing them dynamically
     */
    static async linkEffectsWithConfigs() {
        // Linking Effects with Config Classes

        const allPlugins = PluginRegistry.getAllPlugins();
        let linkedCount = 0;
        let errorCount = 0;

        for (const plugin of allPlugins) {
            const effectName = plugin.name;
            const configClassName = EFFECT_CONFIG_MAPPING[effectName];

            if (configClassName) {
                try {
                    const configClass = await this.importConfigClass(configClassName, effectName);
                    if (configClass) {
                        // Update the effect class with the config class
                        plugin.effectClass._configClass_ = configClass;

                        // Update the plugin registry entry
                        const registryEntry = PluginRegistry.get(effectName);
                        if (registryEntry) {
                            registryEntry.configClass = configClass;
                            linkedCount++;
                            // Linked ${effectName} -> ${configClassName}
                        }
                    } else {
                        console.warn(`  ⚠ Could not import ${configClassName} for ${effectName}`);
                        errorCount++;
                    }
                } catch (error) {
                    console.warn(`  ⚠ Failed to link ${effectName} → ${configClassName}:`, error.message);
                    errorCount++;
                }
            } else {
                console.warn(`  ⚠ No config mapping found for effect: ${effectName}`);
                errorCount++;
            }
        }

        // Successfully linked ${linkedCount} effects with config classes
        if (errorCount > 0) {
            // Failed to link ${errorCount} effects
        }

        return { linked: linkedCount, errors: errorCount, total: allPlugins.length };
    }

    /**
     * Import a config class using multiple strategies
     */
    static async importConfigClass(configClassName, effectName) {
        // Strategy 1: Try importing from known effect paths
        const configPaths = this.generateConfigPaths(configClassName, effectName);

        for (const path of configPaths) {
            try {
                // Trying: ${path}
                const module = await import(path);
                const configClass = module[configClassName] || module.default;
                if (configClass) {
                    return configClass;
                }
            } catch (error) {
                // Continue to next path
            }
        }

        return null;
    }

    /**
     * Generate possible import paths for a config class
     */
    static generateConfigPaths(configClassName, effectName) {
        const packageBase = 'my-nft-effects-core/src/effects';

        // Map effect names to their likely directory paths
        const categoryPaths = {
            // Primary effects patterns
            'amp': 'primaryEffects/amp',
            'blink-on-blink-on-blink-redux': 'primaryEffects/blink-on-blink-on-blink-redux',
            'curved-red-eye': 'primaryEffects/curved-red-eye',
            'encircled-spiral-round-2': 'primaryEffects/encircledSpiral',
            'fuzz-flare': 'primaryEffects/fuzz-flare',
            'fuzz-bands-mark-two': 'primaryEffects/fuzzyBands',
            'fuzzy-ripples': 'primaryEffects/fuzzyRipples',
            'gates': 'primaryEffects/gates',
            'hex': 'primaryEffects/hex',
            'image-overlay': 'primaryEffects/imageOverlay',
            'layered-hex-now-with-fuzz': 'primaryEffects/layeredHex',
            'layered-rings': 'primaryEffects/layeredRing',
            'upgraded-lens-flare': 'primaryEffects/lensFlare',
            'mapped-frames': 'primaryEffects/mappedFrames',
            'nth-rings': 'primaryEffects/nthRings',
            'porous.png': 'primaryEffects/porous',
            'ray-rings': 'primaryEffects/rayRing',
            'ray-rings (inverted)': 'primaryEffects/rayRingInverted',
            'red-eye': 'primaryEffects/red-eye',
            'rolling-gradient': 'primaryEffects/rollingGradient',
            'scan lines': 'primaryEffects/scanLines',
            'scopes': 'primaryEffects/scopes',
            'static-path': 'primaryEffects/static-path',
            'viewport': 'primaryEffects/viewport',

            // Secondary effects
            'edge-glow': 'secondaryEffects/edgeGlow',
            'fade': 'secondaryEffects/fade',
            'glow': 'secondaryEffects/glow',
            'randomize': 'secondaryEffects/randomize',
            'single-layer-blur': 'secondaryEffects/single-layer-blur',
            'single-layer-glitch-drumroll-horizontal-wave': 'secondaryEffects/single-layer-glitch-drumroll-horizontal-wave',
            'single-layer-glitch-fractal': 'secondaryEffects/single-layer-glitch-fractal',

            // Final image effects
            'bloom-film-grain': 'finalImageEffects/bloomFilmGrain',
            'blur': 'finalImageEffects/blur',
            'claude-crt-barrel-roll': 'finalImageEffects/claudeCRTBarrelRoll',
            'colorPulse': 'finalImageEffects/colorPulse',
            'crt-barrel': 'finalImageEffects/crtBarrel',
            'crt-scan-lines': 'finalImageEffects/crtScanLines',
            'crt-shadow': 'finalImageEffects/crtShadow',
            'glitch-drumroll-horizontal-wave': 'finalImageEffects/glitchDrumrollHorizontalWave',
            'glitch-fractal': 'finalImageEffects/glitchFractal',
            'glitch-inverse': 'finalImageEffects/glitchInverse',
            'modulate': 'finalImageEffects/modulate',
            'pixelate': 'finalImageEffects/pixelate',
            'vintage-fade': 'finalImageEffects/vintageFade',

            // Key frame effects
            'blur-event': 'keyFrameEffects/blur',
            'crt-degauss-event': 'keyFrameEffects/crtDegaussEvent',
            'fade-event': 'keyFrameEffects/fade',
            'glow-event': 'keyFrameEffects/glow',
            'pixelate-event': 'keyFrameEffects/pixelate',
            'set-opacity-event': 'keyFrameEffects/setOpacity',
            'static-image': 'keyFrameEffects/staticImageKeyFrame'
        };

        const effectPath = categoryPaths[effectName];
        if (!effectPath) {
            return [];
        }

        return [
            `${packageBase}/${effectPath}/${configClassName}.js`,
            `${packageBase}/${effectPath}/${configClassName}`,
        ];
    }

    /**
     * Validate the linking results
     */
    static validateLinking() {
        const allPlugins = PluginRegistry.getAllPlugins();
        const withConfigs = allPlugins.filter(p => p.configClass);
        const stats = PluginRegistry.getStats();

        console.log('\n=== Config Linking Validation ===');
        console.log(`✓ ${withConfigs.length}/${stats.total} effects have config classes linked`);
        console.log(`✓ ${((withConfigs.length / stats.total) * 100).toFixed(1)}% of effects have configs`);

        return {
            total: stats.total,
            linked: withConfigs.length,
            percentage: ((withConfigs.length / stats.total) * 100).toFixed(1)
        };
    }
}
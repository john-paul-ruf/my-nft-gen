import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Dynamic effect discovery system
 * Scans the file system to find available effects and their configurations
 */
export class EffectDiscovery {

    /**
     * Discover all available effects from the my-nft-gen and my-nft-effects-core repositories
     * @returns {Promise<Object>} Object with effect categories and their available effects
     */
    static async discoverAvailableEffects() {
        try {
            const effects = {
                primary: [],
                secondary: [],
                keyFrame: [],
                final: []
            };

            // Get the directory of this module
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);

            // Paths to scan for effects
            const effectPaths = [
                // my-nft-effects-core primary effects
                {
                    category: 'primary',
                    basePath: path.resolve(__dirname, '../../../../my-nft-effects-core/src/effects/primaryEffects'),
                    modulePrefix: 'my-nft-effects-core/src/effects/primaryEffects'
                },
                // my-nft-gen secondary effects
                {
                    category: 'secondary',
                    basePath: path.resolve(__dirname, '../../effects/secondaryEffects'),
                    modulePrefix: 'my-nft-gen/src/effects/secondaryEffects'
                },
                // my-nft-gen key frame effects
                {
                    category: 'keyFrame',
                    basePath: path.resolve(__dirname, '../../effects/keyFrameEffects'),
                    modulePrefix: 'my-nft-gen/src/effects/keyFrameEffects'
                },
                // my-nft-gen final image effects
                {
                    category: 'final',
                    basePath: path.resolve(__dirname, '../../effects/finalImageEffects'),
                    modulePrefix: 'my-nft-gen/src/effects/finalImageEffects'
                }
            ];

            for (const effectPath of effectPaths) {
                const discoveredEffects = await this.scanEffectDirectory(effectPath);
                effects[effectPath.category].push(...discoveredEffects);
            }

            return effects;

        } catch (error) {
            console.error('Error discovering effects:', error);
            return {
                primary: [],
                secondary: [],
                keyFrame: [],
                final: []
            };
        }
    }

    /**
     * Scan a specific directory for effects
     * @param {Object} pathConfig - Configuration for the path to scan
     * @returns {Promise<Array>} Array of discovered effects
     */
    static async scanEffectDirectory({ category, basePath, modulePrefix }) {
        try {
            const effects = [];

            // Check if directory exists
            try {
                await fs.access(basePath);
            } catch {
                console.warn(`Effect directory not found: ${basePath}`);
                return effects;
            }

            const entries = await fs.readdir(basePath, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const effectDir = path.join(basePath, entry.name);
                    const effect = await this.analyzeEffectDirectory(effectDir, entry.name, modulePrefix);

                    if (effect) {
                        effects.push(effect);
                    }
                }
            }

            return effects;

        } catch (error) {
            console.error(`Error scanning effect directory ${basePath}:`, error);
            return [];
        }
    }

    /**
     * Analyze a single effect directory to extract metadata
     * @param {string} effectDir - Path to the effect directory
     * @param {string} dirName - Name of the directory
     * @param {string} modulePrefix - Module prefix for imports
     * @returns {Promise<Object|null>} Effect metadata or null if not a valid effect
     */
    static async analyzeEffectDirectory(effectDir, dirName, modulePrefix) {
        try {
            const files = await fs.readdir(effectDir);

            // Look for effect and config files
            const effectFile = files.find(f => f.endsWith('Effect.js'));
            const configFile = files.find(f => f.endsWith('Config.js'));

            if (!effectFile || !configFile) {
                return null;
            }

            // Extract effect name from file names
            const effectName = effectFile.replace('.js', '');
            const configName = configFile.replace('.js', '');

            // Try to read the effect file for metadata
            const effectFilePath = path.join(effectDir, effectFile);
            const effectContent = await fs.readFile(effectFilePath, 'utf-8');

            // Extract display name and description from comments or class
            const displayName = this.extractDisplayName(effectContent, effectName);
            const description = this.extractDescription(effectContent);

            return {
                name: effectName,
                displayName,
                description,
                configClass: configName,
                effectFile: `file://${path.join(effectDir, effectFile)}`,
                configModule: `file://${path.join(effectDir, configFile)}`,
                directory: dirName
            };

        } catch (error) {
            console.error(`Error analyzing effect directory ${effectDir}:`, error);
            return null;
        }
    }

    /**
     * Extract display name from effect file content
     * @param {string} content - File content
     * @param {string} fallbackName - Fallback name if none found
     * @returns {string} Display name
     */
    static extractDisplayName(content, fallbackName) {
        // Look for display name in comments
        const displayNameMatch = content.match(/\*\s*@displayName\s+(.+)/i) ||
                                 content.match(/\*\s*Display Name:\s*(.+)/i) ||
                                 content.match(/\/\*\*[^*]*\*\s*(.+)\s*\*/);

        if (displayNameMatch) {
            return displayNameMatch[1].trim();
        }

        // Convert effect name to display name
        let displayName = fallbackName
            .replace(/Effect$/, '')
            .replace(/([A-Z])/g, ' $1')
            .trim();

        // Capitalize first letter of each word
        displayName = displayName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        return displayName || fallbackName;
    }

    /**
     * Extract description from effect file content
     * @param {string} content - File content
     * @returns {string} Description
     */
    static extractDescription(content) {
        // Look for description in comments
        const descriptionMatch = content.match(/\*\s*@description\s+(.+)/i) ||
                                content.match(/\*\s*Description:\s*(.+)/i) ||
                                content.match(/\/\*\*\s*\*[^*]*\*\s*(.+)\s*\*/);

        if (descriptionMatch) {
            return descriptionMatch[1].trim();
        }

        // Look for multi-line description in block comments
        const blockMatch = content.match(/\/\*\*\s*\*\s*\n\s*\*\s*(.+?)\s*\*\//s);
        if (blockMatch) {
            return blockMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*\*\s?/, '').trim())
                .filter(line => line.length > 0)
                .join(' ')
                .substring(0, 200); // Limit description length
        }

        return 'No description available';
    }

    /**
     * Get effect metadata by name and category
     * @param {string} effectName - Name of the effect
     * @param {string} category - Category of the effect
     * @returns {Promise<Object|null>} Effect metadata or null if not found
     */
    static async getEffectMetadata(effectName, category) {
        const allEffects = await this.discoverAvailableEffects();
        const categoryEffects = allEffects[category] || [];

        return categoryEffects.find(effect =>
            effect.name === effectName || effect.displayName === effectName
        ) || null;
    }

    /**
     * Validate that an effect can be loaded
     * @param {Object} effectMetadata - Effect metadata
     * @returns {Promise<boolean>} True if effect can be loaded
     */
    static async validateEffect(effectMetadata) {
        try {
            // Try to import the effect and config modules
            const effectModule = await import(effectMetadata.effectFile);
            const configModule = await import(effectMetadata.configModule);

            // Check if they export the expected classes
            const EffectClass = effectModule[effectMetadata.name];
            const ConfigClass = configModule[effectMetadata.configClass];

            return !!(EffectClass && ConfigClass);

        } catch (error) {
            console.error(`Error validating effect ${effectMetadata.name}:`, error);
            return false;
        }
    }
}
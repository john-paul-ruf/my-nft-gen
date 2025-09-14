import { EffectRegistry } from './EffectRegistry.js';
import { register as registerFromEffectsCore } from 'my-nft-effects-core';

export async function registerCoreEffects() {
    try {
        // Create adapter for the registry interface that my-nft-effects-core expects
        const registryAdapter = {
            register: (effectClass, category) => {
                return EffectRegistry.registerGlobal(effectClass, category);
            }
        };

        // Use the built-in registration function from my-nft-effects-core
        await registerFromEffectsCore(registryAdapter, null);
        console.log('✓ Effects from my-nft-effects-core registered successfully');
    } catch (error) {
        console.warn('⚠ Failed to register effects from my-nft-effects-core:', error.message);
        console.warn('  This may be due to missing dependencies or incomplete package structure.');
    }
}
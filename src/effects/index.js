// Main plugin registration export - bundled effects system
export * from './primaryEffects/index.js';
export * from './secondaryEffects/index.js';
export * from './finalImageEffects/index.js';
export * from './keyFrameEffects/index.js';

// Main registration function for all effects
export async function register(effectRegistry, positionRegistry) {
    // Import and register all effect categories
    const [primaryModule, secondaryModule, finalImageModule, keyFrameModule] = await Promise.all([
        import('./primaryEffects/index.js'),
        import('./secondaryEffects/index.js'),
        import('./finalImageEffects/index.js'),
        import('./keyFrameEffects/index.js')
    ]);

    primaryModule.register(effectRegistry, positionRegistry);
    secondaryModule.register(effectRegistry, positionRegistry);
    finalImageModule.register(effectRegistry, positionRegistry);
    keyFrameModule.register(effectRegistry, positionRegistry);
}
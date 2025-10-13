// Core classes
export { LayerEffect } from './src/core/layer/LayerEffect.js';
export { EffectConfig } from './src/core/layer/EffectConfig.js';
export { Settings } from './src/core/Settings.js';
export { Project, ProjectEvents } from './src/app/Project.js';

// Configuration classes
export { FFmpegConfig } from './src/core/config/FFmpegConfig.js';

// Registry classes
export { PresetRegistry } from './src/core/registry/PresetRegistry.js';
export { EffectRegistry } from './src/core/registry/EffectRegistry.js';
export { ConfigRegistry } from './src/core/registry/ConfigRegistry.js';

// Factory classes
export { Canvas2dFactory } from './src/core/factory/canvas/Canvas2dFactory.js';
export { LayerFactory } from './src/core/factory/layer/LayerFactory.js';

// Math utilities - extended exports to support all imports
export { findValue, FindValueAlgorithm, getAllFindValueAlgorithms } from './src/core/math/findValue.js';
export { findOneWayValue } from './src/core/math/findOneWayValue.js';
export { getRandomFromArray, getRandomIntInclusive, randomId, randomNumber } from './src/core/math/random.js';
export { findPointByAngleAndCircle, getPointsForLayerAndDensity, degreesToRadians } from './src/core/math/drawingMath.js';
export { FindMultiStepStepValue } from './src/core/math/FindMultiStepValue.js';

// Other commonly used utilities that effects might need
export * as DrawingMath from './src/core/math/drawingMath.js';
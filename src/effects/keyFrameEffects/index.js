// Key Frame Effects Plugin Registration
import { BlurKeyFrameEffect } from './blur/BlurKeyFrameEffect.js';
import { CRTDegaussEffect } from './crtDegaussEvent/CRTDegaussEffect.js';
import { FadeKeyFrameEffect } from './fade/FadeKeyFrameEffect.js';
import { GlowKeyFrameEffect } from './glow/GlowKeyFrameEffect.js';
import { PixelateKeyFrameEffect } from './pixelate/PixelateKeyFrameEffect.js';
import { SetOpacityKeyFrameEffect } from './setOpacity/SetOpacityKeyFrameEffect.js';
import { StaticImageKeyFrameEffect } from './staticImageKeyFrame/StaticImageKeyFrameEffect.js';

export const KEY_FRAME_EFFECTS = {
    BlurKeyFrameEffect,
    CRTDegaussEffect,
    FadeKeyFrameEffect,
    GlowKeyFrameEffect,
    PixelateKeyFrameEffect,
    SetOpacityKeyFrameEffect,
    StaticImageKeyFrameEffect
};

export function register(effectRegistry, positionRegistry) {
    const EffectCategories = { KEY_FRAME: 'keyFrame' };
    
    Object.values(KEY_FRAME_EFFECTS).forEach(EffectClass => {
        effectRegistry.register(EffectClass, EffectCategories.KEY_FRAME);
    });
}

export * from './blur/BlurKeyFrameEffect.js';
export * from './crtDegaussEvent/CRTDegaussEffect.js';
export * from './fade/FadeKeyFrameEffect.js';
export * from './glow/GlowKeyFrameEffect.js';
export * from './pixelate/PixelateKeyFrameEffect.js';
export * from './setOpacity/SetOpacityKeyFrameEffect.js';
export * from './staticImageKeyFrame/StaticImageKeyFrameEffect.js';
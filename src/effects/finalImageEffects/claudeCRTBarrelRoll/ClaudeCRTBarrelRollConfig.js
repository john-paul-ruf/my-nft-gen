import {EffectConfig} from 'my-nft-gen/src/core/layer/EffectConfig.js';

export class ClaudeCRTBarrelRollConfig extends EffectConfig {
    constructor(
        {
            rollSpeed = {lower: 0.05, upper: 0.1},
            rollIntensity = {lower: 0.01, upper: 0.05},
            magneticDistortion = {lower: 0.005, upper: 0.02},
            deflectionYokeOffset = {lower: 0.002, upper: 0.01},
            phosphorTrail = {lower: 0.1, upper: 0.3},
            scanLineIntensity = {lower: 0.1, upper: 0.25},
            geometricCorrection = {lower: 0.8, upper: 1.2},
            electronBeamWidth = {lower: 1.0, upper: 2.5},
            crtCurvature = {lower: 0.08, upper: 0.12},
            screenBulge = {lower: 0.02, upper: 0.04},
            edgeBleed = {lower: 0.03, upper: 0.05},
            bleedFalloff = {lower: 0.3, upper: 0.7},
            crtFrame = {lower: 0.02, upper: 0.06},
            frameRoundness = {lower: 0.4, upper: 0.8},
            frameColor = {r: {lower: 15, upper: 25}, g: {lower: 15, upper: 25}, b: {lower: 15, upper: 25}},
            bevelWidth = {lower: 0.3, upper: 0.7},
            bevelHighlight = {r: {lower: 60, upper: 80}, g: {lower: 60, upper: 80}, b: {lower: 60, upper: 80}},
            bevelShadow = {r: {lower: 5, upper: 15}, g: {lower: 5, upper: 15}, b: {lower: 5, upper: 15}},
            glassReflection = {lower: 0.1, upper: 0.3},
            reflectionAngle = {lower: 15, upper: 45},
            reflectionSharpness = {lower: 2, upper: 6},
            glassReflectionTimes = {lower: 1, upper: 2},
            reflectionAngleTimes = {lower: 0.5, upper: 1.5},
            rollIntensityTimes = {lower: 1, upper: 3},
            rollAngleTimes = {lower: 1, upper: 2},
            magneticDistortionTimes = {lower: 2, upper: 4},
            deflectionYokeTimes = {lower: 3, upper: 6},
            scanLineTimes = {lower: 4, upper: 8},
        },
    ) {
        super();
        this.rollSpeed = rollSpeed;
        this.rollIntensity = rollIntensity;
        this.magneticDistortion = magneticDistortion;
        this.deflectionYokeOffset = deflectionYokeOffset;
        this.phosphorTrail = phosphorTrail;
        this.scanLineIntensity = scanLineIntensity;
        this.geometricCorrection = geometricCorrection;
        this.electronBeamWidth = electronBeamWidth;
        this.crtCurvature = crtCurvature;
        this.screenBulge = screenBulge;
        this.edgeBleed = edgeBleed;
        this.bleedFalloff = bleedFalloff;
        this.crtFrame = crtFrame;
        this.frameRoundness = frameRoundness;
        this.frameColor = frameColor;
        this.bevelWidth = bevelWidth;
        this.bevelHighlight = bevelHighlight;
        this.bevelShadow = bevelShadow;
        this.glassReflection = glassReflection;
        this.reflectionAngle = reflectionAngle;
        this.reflectionSharpness = reflectionSharpness;
        this.glassReflectionTimes = glassReflectionTimes;
        this.reflectionAngleTimes = reflectionAngleTimes;
        this.rollIntensityTimes = rollIntensityTimes;
        this.rollAngleTimes = rollAngleTimes;
        this.magneticDistortionTimes = magneticDistortionTimes;
        this.deflectionYokeTimes = deflectionYokeTimes;
        this.scanLineTimes = scanLineTimes;
    }
}
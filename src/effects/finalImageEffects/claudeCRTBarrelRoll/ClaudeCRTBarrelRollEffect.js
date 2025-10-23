import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {randomId, randomNumber} from 'my-nft-gen/src/core/math/random.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {findValue, FindValueAlgorithm} from 'my-nft-gen/src/core/math/findValue.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import sharp from "sharp";
import {promises as fs} from "fs";
import {ClaudeCRTBarrelRollConfig} from "./ClaudeCRTBarrelRollConfig.js";
import {globalBufferPool} from 'my-nft-gen/src/core/pool/BufferPool.js';

export class ClaudeCRTBarrelRollEffect extends LayerEffect {
    static _name_ = 'claude-crt-barrel-roll';

    static presets = [
        {
            name: 'gentle-roll',
            effect: 'claude-crt-barrel-roll',
            percentChance: 100,
            currentEffectConfig: {
                rollSpeed: new Range(0.02, 0.05),
                rollIntensity: new Range(0.005, 0.01),
                magneticDistortion: new Range(0.002, 0.005),
                deflectionYokeOffset: new Range(0.001, 0.003),
                phosphorTrail: new Range(0.05, 0.1),
                scanLineIntensity: new Range(0.05, 0.1),
                geometricCorrection: new Range(0.9, 1.1),
                electronBeamWidth: new Range(1.0, 1.5),
                crtCurvature: new Range(0.06, 0.08),
                screenBulge: new Range(0.01, 0.02),
                edgeBleed: new Range(0.02, 0.03),
                bleedFalloff: new Range(0.4, 0.6),
                crtFrame: new Range(0.02, 0.04),
                frameRoundness: new Range(0.5, 0.7),
                frameColor: {r: new Range(15, 20), g: new Range(15, 20), b: new Range(15, 20)},
                bevelWidth: new Range(0.4, 0.6),
                bevelHighlight: {r: new Range(60, 70), g: new Range(60, 70), b: new Range(60, 70)},
                bevelShadow: {r: new Range(5, 10), g: new Range(5, 10), b: new Range(5, 10)},
                glassReflection: new Range(0.1, 0.15),
                reflectionAngle: new Range(20, 30),
                reflectionSharpness: new Range(3, 4),
                glassReflectionTimes: new Range(1, 1),
                reflectionAngleTimes: new Range(0.5, 1),
                rollIntensityTimes: new Range(1, 2),
                rollAngleTimes: new Range(1, 1),
                magneticDistortionTimes: new Range(2, 3),
                deflectionYokeTimes: new Range(3, 4),
                scanLineTimes: new Range(4, 6),
            }
        },
        {
            name: 'classic-roll',
            effect: 'claude-crt-barrel-roll',
            percentChance: 100,
            currentEffectConfig: {
                rollSpeed: new Range(0.05, 0.1),
                rollIntensity: new Range(0.01, 0.05),
                magneticDistortion: new Range(0.005, 0.02),
                deflectionYokeOffset: new Range(0.002, 0.01),
                phosphorTrail: new Range(0.1, 0.3),
                scanLineIntensity: new Range(0.1, 0.25),
                geometricCorrection: new Range(0.8, 1.2),
                electronBeamWidth: new Range(1.0, 2.5),
                crtCurvature: new Range(0.08, 0.12),
                screenBulge: new Range(0.02, 0.04),
                edgeBleed: new Range(0.03, 0.05),
                bleedFalloff: new Range(0.3, 0.7),
                crtFrame: new Range(0.02, 0.06),
                frameRoundness: new Range(0.4, 0.8),
                frameColor: {r: new Range(15, 25), g: new Range(15, 25), b: new Range(15, 25)},
                bevelWidth: new Range(0.3, 0.7),
                bevelHighlight: {r: new Range(60, 80), g: new Range(60, 80), b: new Range(60, 80)},
                bevelShadow: {r: new Range(5, 15), g: new Range(5, 15), b: new Range(5, 15)},
                glassReflection: new Range(0.1, 0.3),
                reflectionAngle: new Range(15, 45),
                reflectionSharpness: new Range(2, 6),
                glassReflectionTimes: new Range(1, 2),
                reflectionAngleTimes: new Range(0.5, 1.5),
                rollIntensityTimes: new Range(1, 3),
                rollAngleTimes: new Range(1, 2),
                magneticDistortionTimes: new Range(2, 4),
                deflectionYokeTimes: new Range(3, 6),
                scanLineTimes: new Range(4, 8),
            }
        },
        {
            name: 'extreme-roll',
            effect: 'claude-crt-barrel-roll',
            percentChance: 100,
            currentEffectConfig: {
                rollSpeed: new Range(0.15, 0.25),
                rollIntensity: new Range(0.08, 0.15),
                magneticDistortion: new Range(0.03, 0.06),
                deflectionYokeOffset: new Range(0.015, 0.03),
                phosphorTrail: new Range(0.4, 0.6),
                scanLineIntensity: new Range(0.3, 0.5),
                geometricCorrection: new Range(0.6, 1.4),
                electronBeamWidth: new Range(2.5, 4.0),
                crtCurvature: new Range(0.15, 0.2),
                screenBulge: new Range(0.05, 0.08),
                edgeBleed: new Range(0.06, 0.1),
                bleedFalloff: new Range(0.2, 0.5),
                crtFrame: new Range(0.04, 0.08),
                frameRoundness: new Range(0.3, 0.6),
                frameColor: {r: new Range(10, 20), g: new Range(10, 20), b: new Range(10, 20)},
                bevelWidth: new Range(0.2, 0.5),
                bevelHighlight: {r: new Range(70, 90), g: new Range(70, 90), b: new Range(70, 90)},
                bevelShadow: {r: new Range(3, 10), g: new Range(3, 10), b: new Range(3, 10)},
                glassReflection: new Range(0.3, 0.5),
                reflectionAngle: new Range(10, 60),
                reflectionSharpness: new Range(1, 4),
                glassReflectionTimes: new Range(2, 4),
                reflectionAngleTimes: new Range(1, 2),
                rollIntensityTimes: new Range(2, 5),
                rollAngleTimes: new Range(2, 4),
                magneticDistortionTimes: new Range(4, 8),
                deflectionYokeTimes: new Range(6, 12),
                scanLineTimes: new Range(8, 16),
            }
        }
    ];

    constructor({
                    name = ClaudeCRTBarrelRollEffect._name_,
                    requiresLayer = true,
                    config = new ClaudeCRTBarrelRollConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
    }

    async #applyCRTBarrelRoll(filename, filenameOut, currentFrame, numberOfFrames) {
        const image = sharp(filename);
        const {data, info} = await image.raw().toBuffer({resolveWithObject: true});
        const {width, height, channels} = info;

        const rollBuffer = globalBufferPool.getBuffer(width, height, channels);
        const trailBuffer = globalBufferPool.getBuffer(width, height, channels);

        const centerX = width / 2;
        const centerY = height / 2;
        
        // Calculate frame-based roll progression using proper findValue with configurable times
        const rollIntensity = findValue(0, this.data.rollIntensity, this.data.rollIntensityTimes, numberOfFrames, currentFrame, FindValueAlgorithm.ELASTIC_BOUNCE);
        const rollAngle = findValue(0, Math.PI * 2 * this.data.rollSpeed, this.data.rollAngleTimes, numberOfFrames, currentFrame, FindValueAlgorithm.JOURNEY_SIN);
        
        // Authentic CRT physics parameters with animation
        const magneticField = findValue(0, this.data.magneticDistortion, this.data.magneticDistortionTimes, numberOfFrames, currentFrame, FindValueAlgorithm.WAVE_CRASH);
        const yokeOffset = findValue(0, this.data.deflectionYokeOffset, this.data.deflectionYokeTimes, numberOfFrames, currentFrame, FindValueAlgorithm.VOLCANIC);
        const phosphorDecay = this.data.phosphorTrail;
        const scanIntensity = findValue(0, this.data.scanLineIntensity, this.data.scanLineTimes, numberOfFrames, currentFrame, FindValueAlgorithm.PULSE_WAVE);
        const geoCorrection = this.data.geometricCorrection;
        const beamWidth = this.data.electronBeamWidth;
        const crtCurvature = this.data.crtCurvature;
        const screenBulge = this.data.screenBulge;
        const edgeBleed = this.data.edgeBleed;
        const bleedFalloff = this.data.bleedFalloff;
        const glassReflection = findValue(0, this.data.glassReflection, this.data.glassReflectionTimes, numberOfFrames, currentFrame, FindValueAlgorithm.BREATHING);
        const reflectionAngle = findValue(this.data.reflectionAngle - 20, this.data.reflectionAngle + 20, this.data.reflectionAngleTimes, numberOfFrames, currentFrame, FindValueAlgorithm.OCEAN_TIDE) * Math.PI / 180;
        const reflectionSharpness = this.data.reflectionSharpness;

        // Calculate CRT frame dimensions
        const frameThickness = Math.round(Math.min(width, height) * this.data.crtFrame);
        const screenWidth = width - frameThickness * 2;
        const screenHeight = height - frameThickness * 2;
        const screenOffsetX = frameThickness;
        const screenOffsetY = frameThickness;

        // Clear buffers and fill frame area
        rollBuffer.fill(0);
        trailBuffer.fill(0);
        
        // Create beveled frame with curved monitor edges
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const frameIdx = (y * width + x) * channels;
                
                // Simple frame with rounded corners
                const edgeDistX = Math.min(x, width - x - 1);
                const edgeDistY = Math.min(y, height - y - 1);
                const distanceFromEdge = Math.min(edgeDistX, edgeDistY);
                
                // Create rounded frame with curved inner corners
                const cornerRadius = frameThickness * this.data.frameRoundness;
                let shouldDrawFrame = false;
                
                // Check if we're in the outer frame boundary
                const outerEdgeDist = Math.min(x, y, width - x - 1, height - y - 1);
                if (outerEdgeDist < frameThickness) {
                    shouldDrawFrame = true;
                    
                    // Apply rounded outer corners
                    const outerIsInCorner = (x < cornerRadius || x > width - cornerRadius) && 
                                           (y < cornerRadius || y > height - cornerRadius);
                    
                    if (outerIsInCorner) {
                        const outerCornerCenterX = x < cornerRadius ? cornerRadius : width - cornerRadius;
                        const outerCornerCenterY = y < cornerRadius ? cornerRadius : height - cornerRadius;
                        const outerCornerDist = Math.sqrt((x - outerCornerCenterX) ** 2 + (y - outerCornerCenterY) ** 2);
                        
                        if (outerCornerDist > cornerRadius) {
                            shouldDrawFrame = false;
                        }
                    }
                }
                
                // Check for inner curved boundary - curves inward toward center
                const innerFrameX = frameThickness;
                const innerFrameY = frameThickness;
                const innerFrameWidth = width - 2 * frameThickness;
                const innerFrameHeight = height - 2 * frameThickness;
                const innerCornerRadius = cornerRadius * 0.6; // Smaller radius for inner curve
                
                // Distance from inner frame edges
                const innerDistX = Math.min(x - innerFrameX, innerFrameX + innerFrameWidth - x - 1);
                const innerDistY = Math.min(y - innerFrameY, innerFrameY + innerFrameHeight - y - 1);
                
                // If we're inside the inner area, check for curved corners
                if (x >= innerFrameX && x < innerFrameX + innerFrameWidth && 
                    y >= innerFrameY && y < innerFrameY + innerFrameHeight) {
                    
                    const innerIsInCorner = (x < innerFrameX + innerCornerRadius || x > innerFrameX + innerFrameWidth - innerCornerRadius) && 
                                           (y < innerFrameY + innerCornerRadius || y > innerFrameY + innerFrameHeight - innerCornerRadius);
                    
                    if (innerIsInCorner) {
                        // Inner corner centers
                        const innerCornerCenterX = x < innerFrameX + innerCornerRadius ? 
                            innerFrameX + innerCornerRadius : innerFrameX + innerFrameWidth - innerCornerRadius;
                        const innerCornerCenterY = y < innerFrameY + innerCornerRadius ? 
                            innerFrameY + innerCornerRadius : innerFrameY + innerFrameHeight - innerCornerRadius;
                        
                        const innerCornerDist = Math.sqrt((x - innerCornerCenterX) ** 2 + (y - innerCornerCenterY) ** 2);
                        
                        // If inside the inner corner radius, this is frame area (curves inward)
                        if (innerCornerDist < innerCornerRadius) {
                            shouldDrawFrame = true;
                        }
                    }
                }
                
                if (shouldDrawFrame) {
                    // Inside frame area - create bevel effect
                    const bevelProgress = distanceFromEdge / frameThickness;
                    const bevelCurve = Math.sin(bevelProgress * Math.PI * 0.5); // Smooth curve
                    
                    // Bevel lighting simulation with rounded corners
                    const isHighlight = bevelProgress < this.data.bevelWidth;
                    const bevelIntensity = isHighlight ? bevelCurve : (1 - bevelCurve) * 0.5;
                    
                    let r, g, b;
                    if (isHighlight) {
                        // Highlight edge (simulated light from top-left)
                        r = this.data.frameColor.r + (this.data.bevelHighlight.r - this.data.frameColor.r) * bevelIntensity;
                        g = this.data.frameColor.g + (this.data.bevelHighlight.g - this.data.frameColor.g) * bevelIntensity;
                        b = this.data.frameColor.b + (this.data.bevelHighlight.b - this.data.frameColor.b) * bevelIntensity;
                    } else {
                        // Shadow edge (simulated shadow on bottom-right)
                        r = this.data.frameColor.r + (this.data.bevelShadow.r - this.data.frameColor.r) * bevelIntensity;
                        g = this.data.frameColor.g + (this.data.bevelShadow.g - this.data.frameColor.g) * bevelIntensity;
                        b = this.data.frameColor.b + (this.data.bevelShadow.b - this.data.frameColor.b) * bevelIntensity;
                    }
                    
                    rollBuffer[frameIdx] = Math.round(r);
                    rollBuffer[frameIdx + 1] = Math.round(g);
                    rollBuffer[frameIdx + 2] = Math.round(b);
                    rollBuffer[frameIdx + 3] = 255;
                }
            }
        }

        // Process only the screen area (inside the frame)
        for (let y = screenOffsetY; y < screenOffsetY + screenHeight; y++) {
            for (let x = screenOffsetX; x < screenOffsetX + screenWidth; x++) {
                // Map to screen coordinates for distortion calculations
                const screenX = x - screenOffsetX;
                const screenY = y - screenOffsetY;
                const screenCenterX = screenWidth / 2;
                const screenCenterY = screenHeight / 2;
                
                // Normalize to screen space
                const normX = (screenX - screenCenterX) / screenCenterX;
                const normY = (screenY - screenCenterY) / screenCenterY;
                const radius = Math.sqrt(normX * normX + normY * normY);
                
                // Smooth CRT barrel distortion (classic pincushion/barrel effect)
                const r2 = normX * normX + normY * normY;
                const barrelDistortion = 1 + crtCurvature * r2 + screenBulge * r2 * r2;
                
                // Apply smooth barrel warp to get new coordinates
                const newNormX = normX / barrelDistortion;
                const newNormY = normY / barrelDistortion;
                
                // Convert back to original image coordinates for sampling
                const barrelSrcX = newNormX * centerX + centerX;
                const barrelSrcY = newNormY * centerY + centerY;
                
                // Deflection yoke magnetic field simulation
                const yokeDistortion = Math.sin(rollAngle + radius * Math.PI * 2) * yokeOffset;
                const magneticWarp = Math.sin(rollAngle * 2 + y * 0.02) * magneticField;
                
                // Electron beam deflection with roll
                const rollWarp = Math.sin(rollAngle + y * 0.01) * rollIntensity;
                const scanlineWarp = Math.sin(y * 0.1 + rollAngle * 3) * scanIntensity;
                
                // Geometric correction failure during roll
                const geoFailure = (1 - geoCorrection) * Math.sin(rollAngle + radius * Math.PI);
                
                // Apply barrel distortion first, then add roll effects
                const rollXWarp = yokeDistortion + magneticWarp + rollWarp + geoFailure;
                const rollYWarp = scanlineWarp + magneticWarp * 0.5;
                
                // Calculate final source coordinates (barrel + roll) - much subtler
                const srcX = Math.round(barrelSrcX + rollXWarp * width * 0.05);
                const srcY = Math.round(barrelSrcY + rollYWarp * height * 0.03);
                
                // Handle bleeding at screen-to-frame boundary
                let clampedSrcX, clampedSrcY;
                
                // Create visible bleeding by extending content into frame area
                const screenEdgeDistX = Math.min(screenX, screenWidth - screenX - 1);
                const screenEdgeDistY = Math.min(screenY, screenHeight - screenY - 1);
                const minEdgeDist = Math.min(screenEdgeDistX, screenEdgeDistY);
                const bleedZone = Math.min(screenWidth, screenHeight) * this.data.edgeBleed;
                
                // Simple effective edge bleeding - content wraps around screen edges  
                clampedSrcX = Math.floor(srcX);
                clampedSrcY = Math.floor(srcY);
                
                // Handle bleeding by wrapping coordinates when outside screen bounds
                if (clampedSrcX < screenOffsetX) {
                    // Beyond left edge - wrap from right side
                    clampedSrcX = screenOffsetX + screenWidth + (clampedSrcX - screenOffsetX);
                } else if (clampedSrcX >= screenOffsetX + screenWidth) {
                    // Beyond right edge - wrap from left side
                    clampedSrcX = screenOffsetX + (clampedSrcX - screenOffsetX - screenWidth);
                }
                
                if (clampedSrcY < screenOffsetY) {
                    // Beyond top edge - wrap from bottom
                    clampedSrcY = screenOffsetY + screenHeight + (clampedSrcY - screenOffsetY);
                } else if (clampedSrcY >= screenOffsetY + screenHeight) {
                    // Beyond bottom edge - wrap from top
                    clampedSrcY = screenOffsetY + (clampedSrcY - screenOffsetY - screenHeight);
                }
                
                // Final clamp to image bounds
                clampedSrcX = Math.max(0, Math.min(clampedSrcX, width - 1));
                clampedSrcY = Math.max(0, Math.min(clampedSrcY, height - 1));
                
                const destIdx = (y * width + x) * channels;
                
                // Simple bilinear interpolation for smooth sampling
                const srcIdx = (clampedSrcY * width + clampedSrcX) * channels;
                
                let r = data[srcIdx];
                let g = data[srcIdx + 1];
                let b = data[srcIdx + 2];
                let a = data[srcIdx + 3];
                
                // Phosphor trail effect (persistence) - only if alpha > 0
                const trailIdx = destIdx;
                if (currentFrame > 0 && a > 0) {
                    r = r * (1 - phosphorDecay) + trailBuffer[trailIdx] * phosphorDecay;
                    g = g * (1 - phosphorDecay) + trailBuffer[trailIdx + 1] * phosphorDecay;
                    b = b * (1 - phosphorDecay) + trailBuffer[trailIdx + 2] * phosphorDecay;
                }
                
                // Store trail for next frame only if pixel has content
                if (a > 0) {
                    trailBuffer[trailIdx] = r;
                    trailBuffer[trailIdx + 1] = g;
                    trailBuffer[trailIdx + 2] = b;
                    trailBuffer[trailIdx + 3] = a;
                }
                
                // Apply scan line intensity variation
                const scanlineMod = 1 + Math.sin(y * 0.5) * scanIntensity * 0.1;
                
                // CRT glass reflection simulation
                const reflectionVector = {
                    x: Math.cos(reflectionAngle),
                    y: Math.sin(reflectionAngle)
                };
                
                // Calculate reflection based on surface normal of curved glass
                const surfaceNormalX = newNormX * 2 * crtCurvature;
                const surfaceNormalY = newNormY * 2 * crtCurvature;
                const reflectionDot = normX * reflectionVector.x + normY * reflectionVector.y;
                
                // Fresnel-like reflection intensity (stronger at angles)
                const fresnelEffect = Math.pow(Math.abs(reflectionDot), reflectionSharpness);
                const reflectionIntensity = glassReflection * fresnelEffect;
                
                // Add subtle white reflection highlight
                const reflectionR = Math.min(255, r + 255 * reflectionIntensity);
                const reflectionG = Math.min(255, g + 255 * reflectionIntensity);
                const reflectionB = Math.min(255, b + 255 * reflectionIntensity);
                
                // Final pixel output with glass reflection
                rollBuffer[destIdx] = Math.min(255, reflectionR * scanlineMod);
                rollBuffer[destIdx + 1] = Math.min(255, reflectionG * scanlineMod);
                rollBuffer[destIdx + 2] = Math.min(255, reflectionB * scanlineMod);
                rollBuffer[destIdx + 3] = a;
            }
        }

        // Output with optimized settings
        await sharp(rollBuffer, {
            raw: {
                width: width,
                height: height,
                channels: channels
            }
        }).png({compressionLevel: 1, quality: 100, force: true})
          .toFile(filenameOut);
        
        // Return buffers to pool
        globalBufferPool.returnBuffer(rollBuffer, width, height, channels);
        globalBufferPool.returnBuffer(trailBuffer, width, height, channels);
    }

    async #crtBarrelRollEffect(layer, currentFrame, numberOfFrames) {
        const filename = `${this.workingDirectory}claude-crt-barrel-roll${randomId()}.png`;
        const filenameOut = `${this.workingDirectory}claude-crt-barrel-roll-out${randomId()}.png`;
        
        await layer.toFile(filename);
        await this.#applyCRTBarrelRoll(filename, filenameOut, currentFrame, numberOfFrames);
        await layer.fromFile(filenameOut);

        await fs.unlink(filename);
        await fs.unlink(filenameOut);
    }

    #generate(settings) {
        const data = {
            rollSpeed: randomNumber(this.config.rollSpeed.lower, this.config.rollSpeed.upper),
            rollIntensity: randomNumber(this.config.rollIntensity.lower, this.config.rollIntensity.upper),
            magneticDistortion: randomNumber(this.config.magneticDistortion.lower, this.config.magneticDistortion.upper),
            deflectionYokeOffset: randomNumber(this.config.deflectionYokeOffset.lower, this.config.deflectionYokeOffset.upper),
            phosphorTrail: randomNumber(this.config.phosphorTrail.lower, this.config.phosphorTrail.upper),
            scanLineIntensity: randomNumber(this.config.scanLineIntensity.lower, this.config.scanLineIntensity.upper),
            geometricCorrection: randomNumber(this.config.geometricCorrection.lower, this.config.geometricCorrection.upper),
            electronBeamWidth: randomNumber(this.config.electronBeamWidth.lower, this.config.electronBeamWidth.upper),
            crtCurvature: randomNumber(this.config.crtCurvature.lower, this.config.crtCurvature.upper),
            screenBulge: randomNumber(this.config.screenBulge.lower, this.config.screenBulge.upper),
            edgeBleed: randomNumber(this.config.edgeBleed.lower, this.config.edgeBleed.upper),
            bleedFalloff: randomNumber(this.config.bleedFalloff.lower, this.config.bleedFalloff.upper),
            crtFrame: randomNumber(this.config.crtFrame.lower, this.config.crtFrame.upper),
            frameRoundness: randomNumber(this.config.frameRoundness.lower, this.config.frameRoundness.upper),
            frameColor: {
                r: randomNumber(this.config.frameColor.r.lower, this.config.frameColor.r.upper),
                g: randomNumber(this.config.frameColor.g.lower, this.config.frameColor.g.upper),
                b: randomNumber(this.config.frameColor.b.lower, this.config.frameColor.b.upper)
            },
            bevelWidth: randomNumber(this.config.bevelWidth.lower, this.config.bevelWidth.upper),
            bevelHighlight: {
                r: randomNumber(this.config.bevelHighlight.r.lower, this.config.bevelHighlight.r.upper),
                g: randomNumber(this.config.bevelHighlight.g.lower, this.config.bevelHighlight.g.upper),
                b: randomNumber(this.config.bevelHighlight.b.lower, this.config.bevelHighlight.b.upper)
            },
            bevelShadow: {
                r: randomNumber(this.config.bevelShadow.r.lower, this.config.bevelShadow.r.upper),
                g: randomNumber(this.config.bevelShadow.g.lower, this.config.bevelShadow.g.upper),
                b: randomNumber(this.config.bevelShadow.b.lower, this.config.bevelShadow.b.upper)
            },
            glassReflection: randomNumber(this.config.glassReflection.lower, this.config.glassReflection.upper),
            reflectionAngle: randomNumber(this.config.reflectionAngle.lower, this.config.reflectionAngle.upper),
            reflectionSharpness: randomNumber(this.config.reflectionSharpness.lower, this.config.reflectionSharpness.upper),
            glassReflectionTimes: randomNumber(this.config.glassReflectionTimes.lower, this.config.glassReflectionTimes.upper),
            reflectionAngleTimes: randomNumber(this.config.reflectionAngleTimes.lower, this.config.reflectionAngleTimes.upper),
            rollIntensityTimes: randomNumber(this.config.rollIntensityTimes.lower, this.config.rollIntensityTimes.upper),
            rollAngleTimes: randomNumber(this.config.rollAngleTimes.lower, this.config.rollAngleTimes.upper),
            magneticDistortionTimes: randomNumber(this.config.magneticDistortionTimes.lower, this.config.magneticDistortionTimes.upper),
            deflectionYokeTimes: randomNumber(this.config.deflectionYokeTimes.lower, this.config.deflectionYokeTimes.upper),
            scanLineTimes: randomNumber(this.config.scanLineTimes.lower, this.config.scanLineTimes.upper),
        };

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#crtBarrelRollEffect(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: Rolling at ${this.data.rollSpeed.toFixed(2)} speed, ${this.data.rollIntensity.toFixed(2)} intensity, magnetic ${this.data.magneticDistortion.toFixed(2)}, phosphor trail ${this.data.phosphorTrail.toFixed(2)}`;
    }
}
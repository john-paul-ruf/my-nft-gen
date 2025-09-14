import { LayerFactory } from '../factory/layer/LayerFactory.js';
import { Settings } from '../Settings.js';
import { ColorScheme } from '../color/ColorScheme.js';
import { UnifiedEventBus } from '../events/UnifiedEventBus.js';

/**
 * Renders a single effect on a transparent background for preview purposes
 * Uses the UnifiedEventBus for progress reporting and debugging
 */
export class EffectPreviewRenderer {

    static PreviewEvents = {
        PREVIEW_STARTED: 'previewStarted',
        PREVIEW_PROGRESS: 'previewProgress',
        PREVIEW_COMPLETED: 'previewCompleted',
        PREVIEW_ERROR: 'previewError',
        LAYER_CREATED: 'layerCreated',
        EFFECT_APPLIED: 'effectApplied',
        BUFFER_GENERATED: 'bufferGenerated'
    };

    /**
     * Render a single effect at a specific frame
     * @param {Object} options - Rendering options
     * @param {Class} effectClass - The effect class to render
     * @param {Object} effectConfig - Configuration for the effect
     * @param {number} frameNumber - Frame number to render (0-based)
     * @param {number} totalFrames - Total number of frames in animation
     * @param {Object} projectSettings - Project settings (resolution, colors, etc.)
     * @param {UnifiedEventBus} eventBus - Optional event bus for progress reporting
     * @returns {Promise<Buffer>} PNG buffer of the rendered effect
     */
    static async renderSingleEffect({
        effectClass,
        effectConfig,
        frameNumber = 0,
        totalFrames = 60,
        projectSettings = {},
        eventBus = null
    }) {
        // Create or use provided event bus
        const previewEventBus = eventBus || new UnifiedEventBus({
            enableDebug: false,
            enableMetrics: true,
            enableEventHistory: false
        });

        const previewId = `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
            // Emit preview started event
            previewEventBus.emit(this.PreviewEvents.PREVIEW_STARTED, {
                previewId,
                effectClass: effectClass.name,
                frameNumber,
                totalFrames,
                timestamp: new Date().toISOString()
            });

            // Set up preview settings
            const {
                width = 1920,
                height = 1080,
                colorScheme = {},
                neutrals = ['#FFFFFF'],
                backgrounds = ['#000000'],
                lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF']
            } = projectSettings;

            previewEventBus.emit(this.PreviewEvents.PREVIEW_PROGRESS, {
                previewId,
                step: 'settings',
                message: 'Creating preview settings',
                progress: 10
            });

            // Create minimal settings for preview
            const settings = new Settings({
                artist: 'preview',
                projectName: 'effect-preview',
                colorScheme: new ColorScheme(colorScheme),
                neutrals,
                backgrounds,
                lights,
                numberOfFrame: totalFrames,
                longestSideInPixels: Math.max(width, height),
                shortestSideInPixels: Math.min(width, height),
                isHorizontal: width > height,
                projectDirectory: '/tmp/preview',
                maxConcurrentFrameBuilderThreads: 1,
                renderJumpFrames: 1,
                frameStart: 0
            });

            previewEventBus.emit(this.PreviewEvents.PREVIEW_PROGRESS, {
                previewId,
                step: 'layer',
                message: 'Creating transparent layer',
                progress: 30
            });

            // Create transparent layer
            const layer = await LayerFactory.getNewLayer(
                height,
                width,
                'rgba(0, 0, 0, 0)', // Transparent background
                {
                    finalImageSize: {
                        width,
                        height,
                        longestSide: Math.max(width, height),
                        shortestSide: Math.min(width, height)
                    },
                    workingDirectory: '/tmp/preview',
                    layerStrategy: 'sharp'
                }
            );

            previewEventBus.emit(this.PreviewEvents.LAYER_CREATED, {
                previewId,
                dimensions: { width, height },
                background: 'transparent'
            });

            previewEventBus.emit(this.PreviewEvents.PREVIEW_PROGRESS, {
                previewId,
                step: 'effect',
                message: 'Creating effect instance',
                progress: 50
            });

            // Create effect instance
            const effect = new effectClass({
                config: effectConfig,
                settings
            });

            previewEventBus.emit(this.PreviewEvents.PREVIEW_PROGRESS, {
                previewId,
                step: 'apply',
                message: 'Applying effect to layer',
                progress: 70
            });

            // Apply effect to layer
            const context = {
                data: {
                    width,
                    height
                },
                numberOfFrames: totalFrames,
                currentFrame: frameNumber,
                finalImageSize: {
                    width,
                    height,
                    longestSide: Math.max(width, height),
                    shortestSide: Math.min(width, height)
                }
            };

            await effect.invoke(layer, frameNumber, totalFrames);

            previewEventBus.emit(this.PreviewEvents.EFFECT_APPLIED, {
                previewId,
                effectName: effectClass.name,
                frameNumber,
                contextData: context
            });

            previewEventBus.emit(this.PreviewEvents.PREVIEW_PROGRESS, {
                previewId,
                step: 'buffer',
                message: 'Generating PNG buffer',
                progress: 90
            });

            // Get PNG buffer from layer
            const buffer = await layer.toBuffer();

            previewEventBus.emit(this.PreviewEvents.BUFFER_GENERATED, {
                previewId,
                bufferSize: buffer.length,
                format: 'PNG with alpha'
            });

            // Clean up - no destroy method needed

            previewEventBus.emit(this.PreviewEvents.PREVIEW_COMPLETED, {
                previewId,
                bufferSize: buffer.length,
                duration: Date.now() - parseInt(previewId.split('_')[1]),
                timestamp: new Date().toISOString()
            });

            return buffer;

        } catch (error) {
            previewEventBus.emit(this.PreviewEvents.PREVIEW_ERROR, {
                previewId,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });

            // Clean up on error - no destroy method needed

            throw error;
        }
    }

    /**
     * Render a preview animation (multiple frames) of an effect
     * @param {Object} options - Rendering options
     * @param {Class} effectClass - The effect class to render
     * @param {Object} effectConfig - Configuration for the effect
     * @param {number} totalFrames - Total number of frames to render
     * @param {Object} projectSettings - Project settings
     * @param {UnifiedEventBus} eventBus - Optional event bus for progress reporting
     * @returns {Promise<Array<Buffer>>} Array of PNG buffers
     */
    static async renderEffectAnimation({
        effectClass,
        effectConfig,
        totalFrames = 60,
        projectSettings = {},
        eventBus = null
    }) {
        const animationEventBus = eventBus || new UnifiedEventBus({
            enableDebug: false,
            enableMetrics: true,
            enableEventHistory: false
        });

        const animationId = `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const frames = [];

        try {
            animationEventBus.emit('animationStarted', {
                animationId,
                effectClass: effectClass.name,
                totalFrames,
                timestamp: new Date().toISOString()
            });

            for (let frameNumber = 0; frameNumber < totalFrames; frameNumber++) {
                animationEventBus.emit('frameStarted', {
                    animationId,
                    frameNumber,
                    progress: Math.round((frameNumber / totalFrames) * 100)
                });

                const frameBuffer = await this.renderSingleEffect({
                    effectClass,
                    effectConfig,
                    frameNumber,
                    totalFrames,
                    projectSettings,
                    eventBus: animationEventBus
                });

                frames.push(frameBuffer);

                animationEventBus.emit('frameCompleted', {
                    animationId,
                    frameNumber,
                    bufferSize: frameBuffer.length
                });
            }

            animationEventBus.emit('animationCompleted', {
                animationId,
                totalFrames: frames.length,
                totalSize: frames.reduce((sum, frame) => sum + frame.length, 0),
                timestamp: new Date().toISOString()
            });

            return frames;

        } catch (error) {
            animationEventBus.emit('animationError', {
                animationId,
                error: error.message,
                frameNumber: frames.length,
                timestamp: new Date().toISOString()
            });

            throw error;
        }
    }

    /**
     * Create a preview-sized version of an effect (smaller for UI display)
     * @param {Object} options - Same as renderSingleEffect but with smaller dimensions
     * @param {UnifiedEventBus} eventBus - Optional event bus for progress reporting
     * @returns {Promise<Buffer>} Small PNG buffer suitable for UI preview
     */
    static async renderThumbnail({
        effectClass,
        effectConfig,
        frameNumber = 0,
        totalFrames = 60,
        projectSettings = {},
        thumbnailSize = 200,
        eventBus = null
    }) {
        const thumbnailEventBus = eventBus || new UnifiedEventBus({
            enableDebug: false,
            enableMetrics: true,
            enableEventHistory: false
        });

        const thumbnailId = `thumbnail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        thumbnailEventBus.emit('thumbnailStarted', {
            thumbnailId,
            effectClass: effectClass.name,
            thumbnailSize,
            frameNumber,
            timestamp: new Date().toISOString()
        });

        try {
            // Override dimensions for thumbnail
            const thumbnailSettings = {
                ...projectSettings,
                width: thumbnailSize,
                height: thumbnailSize
            };

            const buffer = await this.renderSingleEffect({
                effectClass,
                effectConfig,
                frameNumber,
                totalFrames,
                projectSettings: thumbnailSettings,
                eventBus: thumbnailEventBus
            });

            thumbnailEventBus.emit('thumbnailCompleted', {
                thumbnailId,
                bufferSize: buffer.length,
                dimensions: `${thumbnailSize}x${thumbnailSize}`,
                timestamp: new Date().toISOString()
            });

            return buffer;

        } catch (error) {
            thumbnailEventBus.emit('thumbnailError', {
                thumbnailId,
                error: error.message,
                timestamp: new Date().toISOString()
            });

            throw error;
        }
    }
}
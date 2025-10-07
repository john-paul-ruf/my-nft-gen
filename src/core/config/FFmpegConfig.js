/**
 * FFmpegConfig - Configuration provider for FFmpeg and FFprobe paths
 * 
 * Follows Dependency Inversion Principle:
 * - High-level modules (writeToMp4) depend on abstraction (FFmpegConfig)
 * - Low-level modules (ffmpeg-ffprobe-static) are injected as dependencies
 * 
 * Benefits:
 * ✅ Testability: Can inject mock paths for testing
 * ✅ Flexibility: Can use system ffmpeg or custom builds
 * ✅ Maintainability: Single source of truth for ffmpeg configuration
 */

export class FFmpegConfig {
    /**
     * Create FFmpeg configuration
     * @param {Object} options - Configuration options
     * @param {string} options.ffmpegPath - Path to ffmpeg binary
     * @param {string} options.ffprobePath - Path to ffprobe binary
     */
    constructor({ ffmpegPath, ffprobePath }) {
        if (!ffmpegPath || !ffprobePath) {
            throw new Error('FFmpegConfig requires both ffmpegPath and ffprobePath');
        }
        
        this.ffmpegPath = ffmpegPath;
        this.ffprobePath = ffprobePath;
    }

    /**
     * Create default configuration using ffmpeg-ffprobe-static
     * @returns {Promise<FFmpegConfig>} Default FFmpeg configuration
     */
    static async createDefault() {
        // Dynamic import to avoid hardcoding dependency at module level
        const pathToFfmpeg = await import('ffmpeg-ffprobe-static');
        
        return new FFmpegConfig({
            ffmpegPath: pathToFfmpeg.default.ffmpegPath,
            ffprobePath: pathToFfmpeg.default.ffprobePath
        });
    }

    /**
     * Create configuration from custom paths
     * @param {string} ffmpegPath - Path to ffmpeg binary
     * @param {string} ffprobePath - Path to ffprobe binary
     * @returns {FFmpegConfig} Custom FFmpeg configuration
     */
    static fromPaths(ffmpegPath, ffprobePath) {
        return new FFmpegConfig({ ffmpegPath, ffprobePath });
    }

    /**
     * Create configuration using system-installed ffmpeg
     * Assumes 'ffmpeg' and 'ffprobe' are in PATH
     * @returns {FFmpegConfig} System FFmpeg configuration
     */
    static fromSystem() {
        return new FFmpegConfig({
            ffmpegPath: 'ffmpeg',
            ffprobePath: 'ffprobe'
        });
    }

    /**
     * Get ffmpeg binary path
     * @returns {string} Path to ffmpeg
     */
    getFfmpegPath() {
        return this.ffmpegPath;
    }

    /**
     * Get ffprobe binary path
     * @returns {string} Path to ffprobe
     */
    getFfprobePath() {
        return this.ffprobePath;
    }

    /**
     * Convert to plain object for serialization
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            ffmpegPath: this.ffmpegPath,
            ffprobePath: this.ffprobePath
        };
    }

    /**
     * Create from plain object (deserialization)
     * @param {Object} json - Plain object with paths
     * @returns {FFmpegConfig} FFmpeg configuration
     */
    static fromJSON(json) {
        return new FFmpegConfig({
            ffmpegPath: json.ffmpegPath,
            ffprobePath: json.ffprobePath
        });
    }
}
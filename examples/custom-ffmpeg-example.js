/**
 * Example: Using Custom FFmpeg Configuration
 * 
 * This example demonstrates how to use the new FFmpegConfig feature
 * to inject custom FFmpeg paths instead of using the hardcoded ffmpeg-ffprobe-static.
 * 
 * This follows the Dependency Inversion Principle (DIP).
 */

import { Project, FFmpegConfig } from '../index.js';

async function example1_DefaultBehavior() {
    console.log('\n📦 Example 1: Default Behavior (ffmpeg-ffprobe-static)');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // No changes needed - uses ffmpeg-ffprobe-static by default
    const project = new Project({
        projectName: 'default-example',
        numberOfFrame: 10,
        longestSideInPixels: 100,
        shortestSideInPixels: 100
    });
    
    console.log('✅ Project created with default FFmpeg configuration');
    console.log('   (Uses ffmpeg-ffprobe-static automatically)\n');
}

async function example2_SystemFFmpeg() {
    console.log('\n🖥️  Example 2: Using System-Installed FFmpeg');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Use FFmpeg from system PATH
    const project = new Project({
        projectName: 'system-ffmpeg-example',
        numberOfFrame: 10,
        longestSideInPixels: 100,
        shortestSideInPixels: 100,
        ffmpegConfig: FFmpegConfig.fromSystem()
    });
    
    console.log('✅ Project created with system FFmpeg');
    console.log('   FFmpeg path: ffmpeg (from PATH)');
    console.log('   FFprobe path: ffprobe (from PATH)\n');
}

async function example3_CustomPaths() {
    console.log('\n🔧 Example 3: Using Custom FFmpeg Paths');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Use custom FFmpeg installation
    const customConfig = FFmpegConfig.fromPaths(
        '/usr/local/bin/ffmpeg',
        '/usr/local/bin/ffprobe'
    );
    
    const project = new Project({
        projectName: 'custom-paths-example',
        numberOfFrame: 10,
        longestSideInPixels: 100,
        shortestSideInPixels: 100,
        ffmpegConfig: customConfig
    });
    
    console.log('✅ Project created with custom FFmpeg paths');
    console.log(`   FFmpeg path: ${customConfig.getFfmpegPath()}`);
    console.log(`   FFprobe path: ${customConfig.getFfprobePath()}\n`);
}

async function example4_TestingWithMocks() {
    console.log('\n🧪 Example 4: Testing with Mock Paths');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Perfect for unit tests - inject mock paths
    const mockConfig = FFmpegConfig.fromPaths(
        '/mock/ffmpeg',
        '/mock/ffprobe'
    );
    
    const project = new Project({
        projectName: 'test-project',
        numberOfFrame: 10,
        longestSideInPixels: 100,
        shortestSideInPixels: 100,
        ffmpegConfig: mockConfig
    });
    
    console.log('✅ Project created with mock FFmpeg paths (for testing)');
    console.log(`   FFmpeg path: ${mockConfig.getFfmpegPath()}`);
    console.log(`   FFprobe path: ${mockConfig.getFfprobePath()}\n`);
}

async function example5_ConfigSerialization() {
    console.log('\n💾 Example 5: Configuration Serialization');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Create config
    const config = FFmpegConfig.fromPaths(
        '/opt/ffmpeg/bin/ffmpeg',
        '/opt/ffmpeg/bin/ffprobe'
    );
    
    // Serialize to JSON
    const json = config.toJSON();
    console.log('📤 Serialized config:', JSON.stringify(json, null, 2));
    
    // Deserialize from JSON
    const restored = FFmpegConfig.fromJSON(json);
    console.log('\n📥 Deserialized config:');
    console.log(`   FFmpeg path: ${restored.getFfmpegPath()}`);
    console.log(`   FFprobe path: ${restored.getFfprobePath()}\n`);
}

async function example6_DirectSettingsUsage() {
    console.log('\n⚙️  Example 6: Direct Settings Usage');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const { Settings } = await import('../src/core/Settings.js');
    
    const settings = new Settings({
        runName: 'direct-settings-example',
        numberOfFrame: 10,
        ffmpegConfig: FFmpegConfig.fromSystem()
    });
    
    console.log('✅ Settings created with custom FFmpeg config');
    console.log(`   Config stored: ${settings.ffmpegConfig !== null}\n`);
}

async function example7_ConditionalConfiguration() {
    console.log('\n🔀 Example 7: Conditional Configuration');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Choose configuration based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const isDocker = process.env.DOCKER === 'true';
    
    let ffmpegConfig;
    
    if (isDocker) {
        // Docker container might have FFmpeg in a specific location
        ffmpegConfig = FFmpegConfig.fromPaths(
            '/usr/bin/ffmpeg',
            '/usr/bin/ffprobe'
        );
        console.log('🐳 Using Docker FFmpeg configuration');
    } else if (isProduction) {
        // Production might use system FFmpeg
        ffmpegConfig = FFmpegConfig.fromSystem();
        console.log('🚀 Using system FFmpeg configuration');
    } else {
        // Development uses ffmpeg-ffprobe-static (default)
        ffmpegConfig = null; // Will use default
        console.log('🛠️  Using default FFmpeg configuration (ffmpeg-ffprobe-static)');
    }
    
    const project = new Project({
        projectName: 'conditional-example',
        numberOfFrame: 10,
        longestSideInPixels: 100,
        shortestSideInPixels: 100,
        ffmpegConfig
    });
    
    console.log('✅ Project created with environment-specific configuration\n');
}

// Run all examples
async function runAllExamples() {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║   FFmpeg Configuration Examples                       ║');
    console.log('║   Demonstrating Dependency Inversion Principle        ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    
    await example1_DefaultBehavior();
    await example2_SystemFFmpeg();
    await example3_CustomPaths();
    await example4_TestingWithMocks();
    await example5_ConfigSerialization();
    await example6_DirectSettingsUsage();
    await example7_ConditionalConfiguration();
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║   ✅ All Examples Completed Successfully              ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    console.log('📚 Key Takeaways:');
    console.log('   1. No breaking changes - defaults to ffmpeg-ffprobe-static');
    console.log('   2. Flexible - use system FFmpeg or custom paths');
    console.log('   3. Testable - inject mock paths for testing');
    console.log('   4. Follows DIP - depends on abstraction, not concrete implementation');
    console.log('   5. Serializable - can save/load configuration\n');
}

// Execute
runAllExamples().catch(error => {
    console.error('❌ Example failed:', error);
    process.exit(1);
});
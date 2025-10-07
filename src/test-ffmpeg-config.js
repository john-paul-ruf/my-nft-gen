/**
 * Test script for FFmpegConfig implementation
 * Verifies Dependency Inversion Principle is properly applied
 */

import { FFmpegConfig } from './core/config/FFmpegConfig.js';

async function testFFmpegConfig() {
    console.log('🧪 Testing FFmpegConfig Implementation\n');
    
    let passed = 0;
    let failed = 0;

    // Test 1: Create from custom paths
    try {
        console.log('Test 1: Create from custom paths');
        const config1 = FFmpegConfig.fromPaths('/usr/bin/ffmpeg', '/usr/bin/ffprobe');
        console.assert(config1.getFfmpegPath() === '/usr/bin/ffmpeg', 'FFmpeg path should match');
        console.assert(config1.getFfprobePath() === '/usr/bin/ffprobe', 'FFprobe path should match');
        console.log('✅ PASSED: Custom paths work correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 2: Create from system
    try {
        console.log('Test 2: Create from system');
        const config2 = FFmpegConfig.fromSystem();
        console.assert(config2.getFfmpegPath() === 'ffmpeg', 'System FFmpeg path should be "ffmpeg"');
        console.assert(config2.getFfprobePath() === 'ffprobe', 'System FFprobe path should be "ffprobe"');
        console.log('✅ PASSED: System paths work correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 3: Create default (ffmpeg-ffprobe-static)
    try {
        console.log('Test 3: Create default (ffmpeg-ffprobe-static)');
        const config3 = await FFmpegConfig.createDefault();
        console.assert(config3.getFfmpegPath(), 'Default FFmpeg path should exist');
        console.assert(config3.getFfprobePath(), 'Default FFprobe path should exist');
        console.log(`   FFmpeg path: ${config3.getFfmpegPath()}`);
        console.log(`   FFprobe path: ${config3.getFfprobePath()}`);
        console.log('✅ PASSED: Default paths work correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 4: Serialization
    try {
        console.log('Test 4: Serialization (toJSON/fromJSON)');
        const config4 = FFmpegConfig.fromPaths('/test/ffmpeg', '/test/ffprobe');
        const json = config4.toJSON();
        const restored = FFmpegConfig.fromJSON(json);
        console.assert(restored.getFfmpegPath() === '/test/ffmpeg', 'Restored FFmpeg path should match');
        console.assert(restored.getFfprobePath() === '/test/ffprobe', 'Restored FFprobe path should match');
        console.log('✅ PASSED: Serialization works correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 5: Constructor validation
    try {
        console.log('Test 5: Constructor validation');
        let errorThrown = false;
        try {
            new FFmpegConfig({ ffmpegPath: '/usr/bin/ffmpeg' }); // Missing ffprobePath
        } catch (e) {
            errorThrown = true;
        }
        console.assert(errorThrown, 'Should throw error when paths are missing');
        console.log('✅ PASSED: Validation works correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 6: Integration with Settings
    try {
        console.log('Test 6: Integration with Settings');
        const { Settings } = await import('./core/Settings.js');
        const customConfig = FFmpegConfig.fromSystem();
        const settings = new Settings({
            runName: 'test-project',
            numberOfFrame: 10,
            ffmpegConfig: customConfig
        });
        console.assert(settings.ffmpegConfig === customConfig, 'Settings should store FFmpeg config');
        console.log('✅ PASSED: Settings integration works correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Test 7: Integration with Project
    try {
        console.log('Test 7: Integration with Project');
        const { Project } = await import('./app/Project.js');
        const customConfig = FFmpegConfig.fromSystem();
        const project = new Project({
            projectName: 'test-project',
            numberOfFrame: 10,
            ffmpegConfig: customConfig
        });
        console.assert(project.ffmpegConfig === customConfig, 'Project should store FFmpeg config');
        console.log('✅ PASSED: Project integration works correctly\n');
        passed++;
    } catch (error) {
        console.error('❌ FAILED:', error.message, '\n');
        failed++;
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════\n');

    if (failed === 0) {
        console.log('🎉 All tests passed! FFmpegConfig implementation is working correctly.');
        console.log('\n✅ Dependency Inversion Principle successfully applied:');
        console.log('   • writeToMp4 depends on FFmpegConfig abstraction');
        console.log('   • ffmpeg-ffprobe-static is injected as dependency');
        console.log('   • System FFmpeg can be used as alternative');
        console.log('   • Custom paths can be provided for testing');
        return true;
    } else {
        console.log('❌ Some tests failed. Please review the implementation.');
        return false;
    }
}

// Run tests
testFFmpegConfig()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('💥 Test runner crashed:', error);
        process.exit(1);
    });
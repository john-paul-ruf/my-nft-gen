# FFmpeg Configuration Guide

## Overview

The `my-nft-gen` library now follows the **Dependency Inversion Principle** for FFmpeg configuration. Instead of hardcoding `ffmpeg-ffprobe-static`, you can now inject custom FFmpeg paths.

## Benefits

✅ **Testability**: Inject mock paths for testing  
✅ **Flexibility**: Use system FFmpeg, custom builds, or different distributions  
✅ **Maintainability**: Single source of truth for FFmpeg configuration  
✅ **No Breaking Changes**: Defaults to `ffmpeg-ffprobe-static` if not specified  

---

## Usage Examples

### 1. Default Behavior (No Changes Required)

If you don't specify FFmpeg configuration, the library uses `ffmpeg-ffprobe-static` automatically:

```javascript
import { Project } from 'my-nft-gen';

const project = new Project({
    projectName: 'my-artwork',
    numberOfFrame: 1800
    // No ffmpegConfig needed - uses ffmpeg-ffprobe-static by default
});

await project.generateRandomLoop();
```

---

### 2. Using System-Installed FFmpeg

Use FFmpeg and FFprobe from your system PATH:

```javascript
import { Project, FFmpegConfig } from 'my-nft-gen';

const project = new Project({
    projectName: 'my-artwork',
    numberOfFrame: 1800,
    ffmpegConfig: FFmpegConfig.fromSystem()
});

await project.generateRandomLoop();
```

---

### 3. Using Custom FFmpeg Paths

Specify exact paths to custom FFmpeg binaries:

```javascript
import { Project, FFmpegConfig } from 'my-nft-gen';

const customConfig = FFmpegConfig.fromPaths(
    '/usr/local/bin/ffmpeg',
    '/usr/local/bin/ffprobe'
);

const project = new Project({
    projectName: 'my-artwork',
    numberOfFrame: 1800,
    ffmpegConfig: customConfig
});

await project.generateRandomLoop();
```

---

### 4. Using Custom Paths (Alternative Constructor)

```javascript
import { Project, FFmpegConfig } from 'my-nft-gen';

const customConfig = new FFmpegConfig({
    ffmpegPath: '/opt/ffmpeg/bin/ffmpeg',
    ffprobePath: '/opt/ffmpeg/bin/ffprobe'
});

const project = new Project({
    projectName: 'my-artwork',
    ffmpegConfig: customConfig
});
```

---

### 5. Testing with Mock Paths

Perfect for unit tests:

```javascript
import { FFmpegConfig } from 'my-nft-gen';

const mockConfig = FFmpegConfig.fromPaths(
    '/mock/ffmpeg',
    '/mock/ffprobe'
);

// Use in tests
const project = new Project({
    projectName: 'test-project',
    ffmpegConfig: mockConfig
});
```

---

### 6. Direct Usage with Settings

You can also pass FFmpeg configuration directly to Settings:

```javascript
import { Settings, FFmpegConfig } from 'my-nft-gen';

const settings = new Settings({
    runName: 'my-project',
    numberOfFrame: 1800,
    ffmpegConfig: FFmpegConfig.fromSystem()
});
```

---

### 7. Serialization Support

FFmpegConfig can be serialized and deserialized:

```javascript
import { FFmpegConfig } from 'my-nft-gen';

const config = FFmpegConfig.fromSystem();

// Serialize
const json = config.toJSON();
console.log(json);
// { ffmpegPath: 'ffmpeg', ffprobePath: 'ffprobe' }

// Deserialize
const restored = FFmpegConfig.fromJSON(json);
```

---

## API Reference

### `FFmpegConfig` Class

#### Static Methods

##### `FFmpegConfig.createDefault()`
Returns a Promise that resolves to FFmpegConfig using `ffmpeg-ffprobe-static`.

```javascript
const config = await FFmpegConfig.createDefault();
```

##### `FFmpegConfig.fromSystem()`
Creates FFmpegConfig using system-installed FFmpeg (assumes `ffmpeg` and `ffprobe` are in PATH).

```javascript
const config = FFmpegConfig.fromSystem();
```

##### `FFmpegConfig.fromPaths(ffmpegPath, ffprobePath)`
Creates FFmpegConfig with custom paths.

```javascript
const config = FFmpegConfig.fromPaths('/usr/bin/ffmpeg', '/usr/bin/ffprobe');
```

##### `FFmpegConfig.fromJSON(json)`
Deserializes FFmpegConfig from plain object.

```javascript
const config = FFmpegConfig.fromJSON({ 
    ffmpegPath: '/usr/bin/ffmpeg', 
    ffprobePath: '/usr/bin/ffprobe' 
});
```

#### Instance Methods

##### `getFfmpegPath()`
Returns the path to the FFmpeg binary.

##### `getFfprobePath()`
Returns the path to the FFprobe binary.

##### `toJSON()`
Serializes the configuration to a plain object.

---

## Architecture

### Before (Hardcoded Dependency)

```javascript
// ❌ BAD: Direct dependency on concrete implementation
import pathToFfmpeg from 'ffmpeg-ffprobe-static';

export const writeToMp4 = async (fileSelector, config) => {
    const pass1 = ffmpeg(fileSelector)
        .setFfmpegPath(pathToFfmpeg.ffmpegPath)
        .setFfprobePath(pathToFfmpeg.ffprobePath);
    // ...
};
```

**Problems:**
- Tight coupling to `ffmpeg-ffprobe-static`
- Cannot use system FFmpeg
- Difficult to test
- Violates Dependency Inversion Principle

### After (Dependency Injection)

```javascript
// ✅ GOOD: Depends on abstraction (FFmpegConfig)
import { FFmpegConfig } from '../config/FFmpegConfig.js';

export const writeToMp4 = async (fileSelector, config, eventEmitter, ffmpegConfig) => {
    // Use default if not provided
    const ffmpegPaths = ffmpegConfig || await FFmpegConfig.createDefault();
    
    const pass1 = ffmpeg(fileSelector)
        .setFfmpegPath(ffmpegPaths.getFfmpegPath())
        .setFfprobePath(ffmpegPaths.getFfprobePath());
    // ...
};
```

**Benefits:**
- Loose coupling through abstraction
- Flexible configuration
- Easy to test with mocks
- Follows Dependency Inversion Principle

---

## Migration Guide

### Existing Code (No Changes Needed)

Your existing code will continue to work without modifications:

```javascript
// This still works - uses ffmpeg-ffprobe-static by default
const project = new Project({ projectName: 'my-art' });
await project.generateRandomLoop();
```

### Opt-In to Custom Configuration

When you're ready, add FFmpeg configuration:

```javascript
// New: Use system FFmpeg
const project = new Project({ 
    projectName: 'my-art',
    ffmpegConfig: FFmpegConfig.fromSystem()
});
```

---

## SOLID Principles Applied

### Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Before:**
- `writeToMp4` (high-level) → `ffmpeg-ffprobe-static` (low-level) ❌

**After:**
- `writeToMp4` (high-level) → `FFmpegConfig` (abstraction) ✅
- `ffmpeg-ffprobe-static` (low-level) → `FFmpegConfig` (abstraction) ✅

### Single Responsibility Principle (SRP)

`FFmpegConfig` has one responsibility: provide FFmpeg binary paths.

### Open/Closed Principle (OCP)

The system is now open for extension (add new FFmpeg sources) but closed for modification (no need to change `writeToMp4`).

---

## Troubleshooting

### "FFmpegConfig requires both ffmpegPath and ffprobePath"

Make sure you provide both paths when creating a custom config:

```javascript
// ❌ Wrong
const config = new FFmpegConfig({ ffmpegPath: '/usr/bin/ffmpeg' });

// ✅ Correct
const config = new FFmpegConfig({ 
    ffmpegPath: '/usr/bin/ffmpeg',
    ffprobePath: '/usr/bin/ffprobe'
});
```

### System FFmpeg Not Found

If using `FFmpegConfig.fromSystem()`, ensure FFmpeg is installed and in your PATH:

```bash
# Check if FFmpeg is available
which ffmpeg
which ffprobe

# Install on macOS
brew install ffmpeg

# Install on Ubuntu/Debian
sudo apt-get install ffmpeg
```

---

## Performance Notes

- `FFmpegConfig.createDefault()` is async (loads `ffmpeg-ffprobe-static` dynamically)
- `FFmpegConfig.fromSystem()` and `FFmpegConfig.fromPaths()` are synchronous
- Configuration is passed through the call chain (no performance overhead)

---

## Future Enhancements

Potential future additions:
- Validation of FFmpeg paths
- Version detection
- Capability detection (supported codecs)
- Docker container support
- Cloud-based FFmpeg services
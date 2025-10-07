# FFmpeg Configuration - Quick Reference

## Import

```javascript
import { Project, FFmpegConfig } from 'my-nft-gen';
```

---

## Usage Patterns

### 1️⃣ Default (Recommended for most users)
```javascript
const project = new Project({ projectName: 'my-art' });
// Uses ffmpeg-ffprobe-static automatically
```

### 2️⃣ System FFmpeg
```javascript
const project = new Project({
    projectName: 'my-art',
    ffmpegConfig: FFmpegConfig.fromSystem()
});
```

### 3️⃣ Custom Paths
```javascript
const project = new Project({
    projectName: 'my-art',
    ffmpegConfig: FFmpegConfig.fromPaths(
        '/path/to/ffmpeg',
        '/path/to/ffprobe'
    )
});
```

### 4️⃣ Testing/Mocking
```javascript
const mockConfig = FFmpegConfig.fromPaths('/mock/ffmpeg', '/mock/ffprobe');
const project = new Project({ ffmpegConfig: mockConfig });
```

---

## Factory Methods

| Method | Use Case | Example |
|--------|----------|---------|
| `FFmpegConfig.createDefault()` | Use bundled ffmpeg-ffprobe-static (async) | `await FFmpegConfig.createDefault()` |
| `FFmpegConfig.fromSystem()` | Use system-installed FFmpeg | `FFmpegConfig.fromSystem()` |
| `FFmpegConfig.fromPaths(ff, fp)` | Use custom paths | `FFmpegConfig.fromPaths('/usr/bin/ffmpeg', '/usr/bin/ffprobe')` |
| `FFmpegConfig.fromJSON(json)` | Deserialize from JSON | `FFmpegConfig.fromJSON({ ffmpegPath: '...', ffprobePath: '...' })` |

---

## Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getFfmpegPath()` | `string` | Get FFmpeg binary path |
| `getFfprobePath()` | `string` | Get FFprobe binary path |
| `toJSON()` | `object` | Serialize to plain object |

---

## Environment-Based Configuration

```javascript
const ffmpegConfig = process.env.NODE_ENV === 'production'
    ? FFmpegConfig.fromSystem()
    : null; // Use default in development

const project = new Project({ projectName: 'my-art', ffmpegConfig });
```

---

## Docker Example

```javascript
// Dockerfile
FROM node:18
RUN apt-get update && apt-get install -y ffmpeg

// JavaScript
const project = new Project({
    projectName: 'my-art',
    ffmpegConfig: FFmpegConfig.fromSystem() // Uses Docker's FFmpeg
});
```

---

## Serialization

```javascript
// Save
const config = FFmpegConfig.fromSystem();
const json = config.toJSON();
fs.writeFileSync('config.json', JSON.stringify(json));

// Load
const json = JSON.parse(fs.readFileSync('config.json'));
const config = FFmpegConfig.fromJSON(json);
```

---

## Common Paths

| Platform | FFmpeg Path | FFprobe Path |
|----------|-------------|--------------|
| macOS (Homebrew) | `/opt/homebrew/bin/ffmpeg` | `/opt/homebrew/bin/ffprobe` |
| Ubuntu/Debian | `/usr/bin/ffmpeg` | `/usr/bin/ffprobe` |
| Windows | `C:\ffmpeg\bin\ffmpeg.exe` | `C:\ffmpeg\bin\ffprobe.exe` |
| System PATH | `ffmpeg` | `ffprobe` |

---

## Troubleshooting

### Error: "FFmpegConfig requires both ffmpegPath and ffprobePath"
**Solution:** Provide both paths
```javascript
// ❌ Wrong
new FFmpegConfig({ ffmpegPath: '/usr/bin/ffmpeg' });

// ✅ Correct
new FFmpegConfig({ 
    ffmpegPath: '/usr/bin/ffmpeg',
    ffprobePath: '/usr/bin/ffprobe'
});
```

### Error: "ffmpeg: command not found"
**Solution:** Install FFmpeg or use bundled version
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Or use default (no config needed)
const project = new Project({ projectName: 'my-art' }); // Uses bundled
```

---

## Benefits

| Benefit | Description |
|---------|-------------|
| 🧪 **Testability** | Inject mock paths for unit tests |
| 🔧 **Flexibility** | Use system FFmpeg, custom builds, or bundled version |
| 📦 **Maintainability** | Single source of truth for FFmpeg configuration |
| ✅ **Backward Compatible** | Existing code works without changes |
| 🌍 **Environment-Aware** | Different configs for dev/prod/docker |

---

## SOLID Principle

This implementation follows the **Dependency Inversion Principle (DIP)**:

```
High-level module (writeToMp4)
        ↓ depends on
    Abstraction (FFmpegConfig)
        ↑ implements
Low-level module (ffmpeg-ffprobe-static)
```

**Result:** Loose coupling, high flexibility, easy testing

---

## More Information

- 📖 Full Guide: `FFMPEG_CONFIG_USAGE.md`
- 📝 Refactoring Details: `REFACTORING_SUMMARY.md`
- 💻 Examples: `examples/custom-ffmpeg-example.js`
- 🧪 Tests: `src/test-ffmpeg-config.js`
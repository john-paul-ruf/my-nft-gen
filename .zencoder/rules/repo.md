---
description: Repository Information Overview
alwaysApply: true
---

# my-nft-gen Information

## Summary
A fully programmable, high-performance generative loop engine for creating mesmerizing, seamless visual animations. The project enables generation of infinite variations using configurable parameters including layering, timing, glitching, geometry, color palettes, and modulation. Built with Node.js and a plugin-based architecture for maximum flexibility.

## Structure
- **src/app**: Core application classes including Project and ResumeProject
- **src/core**: Core functionality modules (math, color, layer, events, worker-threads)
- **src/cli**: Command-line interface tools for plugin management
- **src/projects**: Generated project output directory
- **tests**: Jest test files for core functionality
- **examples**: Example scripts demonstrating usage
- **docs**: Documentation for specific effects and systems

## Language & Runtime
**Language**: JavaScript (ES Modules)
**Version**: Node.js (Modern ES6+)
**Build System**: None (direct execution)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- ffmpeg-ffprobe-static: ^6.1.2-rc.1
- fluent-ffmpeg: ^2.1.3
- jimp: ^0.22.10
- sharp: ^0.33.1
- my-nft-effects-core: Local dependency (../my-nft-effects-core)

**Development Dependencies**:
- babel-jest: ^29.7.0
- jest: ^29.7.0
- @babel/core: ^7.23.3
- @babel/preset-env: ^7.23.3

## Build & Installation
```bash
npm install
npm run quick-test  # Generate a sample loop
```

## Architecture
**Plugin-Based Effects System**: Core effects extracted into `my-nft-effects-core` for modular development
**Worker Thread Parallelization**: Frame generation uses Node.js worker threads for optimal performance
**Multi-Layer Composition**: Primary effects, secondary effects, and final image processing with advanced blending
**Mathematical Animation Engine**: Frame-based interpolation with multi-step definitions for complex animation curves

## Main Files
**Entry Point**: index.js (exports core classes and utilities)
**Core Classes**:
- Project.js: Main project configuration and generation
- LayerEffect.js: Base class for all visual effects
- EffectConfig.js: Configuration for effects
- Settings.js: Global settings management

## Testing
**Framework**: Jest
**Test Location**: /tests directory
**Configuration**: jest configuration in package.json and babel.config.cjs
**Run Command**:
```bash
npm test
```

## Usage
```javascript
import { Project } from 'my-nft-gen';

const project = new Project({
  width: 1080,
  height: 1080,
  totalFrames: 120,
  framesPerSecond: 24
});

// Add effects and generate
project.generate();
```
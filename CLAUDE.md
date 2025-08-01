im# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Run tests**: `npm test` (Jest with coverage)
- **Quick test**: `npm run quick-test` (runs src/mp4-test.js)
- **Install dependencies**: `npm install`

## Project Overview

This is a generative NFT/art loop engine built with Node.js that creates mesmerizing, seamless visual animations. It uses a highly configurable effects system to generate infinite variations of animated loops.

### Key Dependencies
- **Canvas/Image Processing**: `sharp` (primary), `canvas`, `jimp`, `fabric`
- **Video Processing**: `fluent-ffmpeg`, `ffmpeg-ffprobe-static`
- **Testing**: `jest` with babel-jest transforms

## Architecture

### Core Components

**Project & Settings (`src/app/`, `src/core/Settings.js`)**
- `Project` class orchestrates the entire generation process
- `Settings` manages configuration, color schemes, effects, and output parameters
- Effects are applied probabilistically based on `percentChance` values

**Animation System (`src/core/animation/`)**
- `LoopBuilder` coordinates frame generation using worker threads for parallelization
- Uses `maxConcurrentFrameBuilderThreads` to control resource usage
- Generates PNG frames sequentially, then converts to MP4

**Effects System (`src/effects/`)**
Three categories of effects:
- **Primary Effects**: Core visual elements (e.g., FuzzFlare, LayeredHex, Gates, Hex)
- **Secondary Effects**: Applied to primary effects (e.g., Glow, Fade, Blur)
- **Final Image Effects**: Post-processing (e.g., CRT effects, Glitch, Pixelate)

**Layer System (`src/core/factory/layer/`)**
- `LayerFactory` creates layers using strategy pattern
- Currently uses `SharpLayerStrategy` exclusively (Jimp deprecated)
- Handles compositing and blending of visual elements

**Configuration System (`src/core/layer/configType/`)**
- Type-safe configuration objects for effects
- Supports ranges, percentages, color pickers, and multi-step definitions
- Uses `findValue.js` and related math utilities for animation interpolation

### Key Concepts

**Color Management**
- `ColorScheme` manages color palettes with buckets for different color types
- Separate buckets for neutrals, backgrounds, and lights
- Effects can use `ColorPicker.SelectionType.colorBucket` for dynamic color selection

**Mathematical Animation**
- `findValue.js` and `FindMultiStepValue.js` handle complex animation curves
- Supports multi-step definitions for varying animation intensity over time
- Uses frame-based interpolation for smooth transitions

**Worker Thread Architecture**
- Frame generation is parallelized using Node.js worker threads
- `RequestNewFrameBuilderThread` and `RequestNewWorkerThread` manage concurrency
- Settings are serialized to JSON for thread communication

### Output Structure

Generated projects create:
- Individual PNG frames
- MP4 video output
- Artist card (metadata)
- Screen capture (preview image)
- Settings JSON file for reproduction

### Testing

The codebase includes tests for core mathematical functions:
- `drawingMath.test.js`
- `findMultiStepValue.test.js` 
- `findValue.test.js`

### Example Usage

See `src/mp4-test.js` for a complete example of:
1. Creating a `Project` with configuration
2. Adding effects with detailed configuration
3. Generating the final loop

The companion repository [nft-scratch](https://github.com/john-paul-ruf/nft-scratch) contains additional usage examples and composition scripts.
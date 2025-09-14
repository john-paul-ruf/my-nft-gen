# my-nft-gen

🎞️ A fully programmable, high-performance generative loop engine for creating mesmerizing, seamless visual animations.

Generate infinite variations using configurable parameters: layering, timing, glitching, geometry, color palettes, modulation, and more. Built with Node.js and a plugin-based architecture for maximum flexibility.

From hypnotic radial symmetry to chaotic CRT glitch storms, my-nft-gen puts creative control directly in your hands — one frame at a time.

---

## 💼 Is it free to use?

Yes. However, **if you generate gross revenue of any kind**, you owe a **1% cut** to the author, John Paul Ruf. See the [`LICENSE.md`](LICENSE.md) for details.

---

## 🏗️ Architecture

**Plugin-Based Effects System**: Core effects have been extracted into `my-nft-effects-core` for modular development

**Worker Thread Parallelization**: Frame generation uses Node.js worker threads for optimal performance

**Multi-Layer Composition**: Primary effects, secondary effects, and final image processing with advanced blending

**Mathematical Animation Engine**: Frame-based interpolation with multi-step definitions for complex animation curves

---

## 🚀 Quick Start

```bash
npm install
npm run quick-test  # Generate a sample loop
npm test            # Run test suite with coverage
```

### Basic Usage

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

See [nft-scratch](https://github.com/john-paul-ruf/nft-scratch) for real-world composition examples.

---

## 🎨 Effects System

**51 Built-in Effects** organized into categories:

- **Primary Effects** (24): Core visual elements - FuzzFlare, LayeredHex, Gates, RedEye, etc.
- **Secondary Effects** (7): Applied to primary effects - Glow, Fade, Blur, EdgeGlow, etc.
- **Final Image Effects** (13): Post-processing - CRT, Glitch, Pixelate, ColorPulse, etc.
- **Key Frame Effects** (7): Frame-specific animations - Blur, Fade, Static keyframes, etc.

All effects support:
- Animated transitions with multi-step definitions
- Dynamic color picking from customizable palettes
- Range-based parameters for variation
- Advanced blending and compositing modes

**Plugin Architecture**: Effects are modular plugins registered with `EffectRegistry`

---

## 📦 Related Projects

- **[nft-scratch](https://github.com/john-paul-ruf/nft-scratch)** - Real-world composition scripts and examples
- **my-nft-effects-core** - Extracted effects library with plugin architecture

## 🐛 Issues & Support

Report bugs at **[john.paul.ruf@gmail.com](mailto:john.paul.ruf@gmail.com)**. This software is actively developed and used daily.

---

Made with ♥ by **John Paul Ruf**
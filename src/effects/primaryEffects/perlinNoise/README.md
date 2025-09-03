# PerlinNoiseEffect

Generates an animated Perlin noise texture and tints it with a color gradient.

## Parameters
- `scale`: Base frequency for the noise, smaller values yield larger patterns.
- `speed`: Amount the noise seed changes each frame to animate the texture.
- `colorScheme`: Array `[lowColor, highColor]` mapping noise values to colors.

## Usage
See `src/perlin-noise-test.js` for an example project using this effect.

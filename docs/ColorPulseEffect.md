# ColorPulseEffect

The **ColorPulseEffect** is a final image effect that creates rhythmic changes in saturation and brightness. Values follow a sinusoidal curve, giving the image a breathing, pulsating quality. A glitch system can introduce occasional spikes for extra energy.

## Configuration

| Option | Type | Description |
| --- | --- | --- |
| `pulseAmount` | Number | Amplitude of the pulse. `0.1` is subtle, `0.5` is intense. |
| `pulseSpeed` | Number | Number of full pulses across the animation. `2` means two complete cycles. |
| `glitchChance` | Number | Percent chance per frame to add a random spike to the intensity. |

## Examples

```js
// Gentle breathing pulse
new ColorPulseEffect({
  config: new ColorPulseConfig({
    pulseAmount: 0.1,
    pulseSpeed: 1,
    glitchChance: 0,
  })
});

// Rapid pulse with occasional bursts
new ColorPulseEffect({
  config: new ColorPulseConfig({
    pulseAmount: 0.5,
    pulseSpeed: 4,
    glitchChance: 15,
  })
});
```

The first example produces a soft, almost imperceptible modulation, while the second creates a high-intensity strobe-like effect with random surges in saturation and brightness.

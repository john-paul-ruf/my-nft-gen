# my-nft-gen

Searching for the perfect loop?  my-nft-gen makes loops.  An infinite amount of loops.  With a massive amount of setting with which to change the output.  

## Example usage
To create a loop, first define a Project.  
```
const exampleProject = new Project({
   artist: 'sample user',  
   projectName: 'example-project',  
   projectDirectory: 'src/example-project/', //Location of the project folder
   neutrals: ['#FFFFFF'],  
   backgrounds: ['#00000000'],
   numberOfFrame: 1800,  //targets 120 frames per second, so this is a 15-second loop
   colorScheme: [
      '#ffd439',
      '#fa448c',
      '#faa405',
      '#f72215',
      '#a0c409',
      '#1cb0d4',
   ],
   longestSideInPixels = 1920,  //This should be a standard video resolution
   shortestSideInPixels = 1080,
   isHorizontal = false,  //Vertical or horizontal video
});
```

Once you have a project defined, you can add effects. There are three types of effects: primary, secondary, and final. The primary effects are individual layers. Secondary effects can be applied to primary effects. Final effects are applied to the composite image.

```
await exampleProject.addPrimaryEffect({
      layerConfig: new LayerConfig({
          effect: StaticPathEffect,  //Effect to apply
          percentChance: 100,  //Percent chance it will be in the generated loop. 100 guarantees effect
          currentEffectConfig: new StaticPathConfig({  //The config for the effect
              invertLayers: false,
              layerOpacity: 0.7,
              underLayerOpacity: 0.5,
              center: new Point2D(1080 / 2, 1920 / 2),
              innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),  //This will pick randomly from the colorScheme array defined on the project
              outerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),  //this will pick randomly from the neutral array defined on the project
              stroke: 0,
              thickness: 1,
              sparsityFactor: [9, 10, 12],
              innerRadius: 400,
              outerRadius: 900,
              possibleJumpRangeInPixels: {lower: 5, upper: 20},
              lineLength: {lower: 80, upper: 100},
              numberOfLoops: {lower: 1, upper: 1},
              accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
              blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
              featherTimes: {lower: 0, upper: 0},
          }),
          possibleSecondaryEffects: [ //Array for applying secondary effects
              new LayerConfig({
                  effect: GlowEffect,
                  percentChance: 100, //Percent chance it will be in the generated loop. 100 guarantees effect
                  currentEffectConfig: new GlowConfig({
                      lowerRange: {lower: 0, upper: 0},
                      upperRange: {lower: 360, upper: 360},
                      times: {lower: 2, upper: 2}
                  }),
              }),
          ]
      }),
  });

```

Once you have added the effects to the program, it is time to generate the loop.

```
exampleProject.generateRandomLoop(false) //set to true to keep the frames generated to created the video from being deleted
```

## Effects List
### Final Effects
Final effects are applied to the composite image and not a single layer effect
#### Blur Effect
Creates an animated blur for the composite image. Can be glitched to appear on a percentage of the frames generated. Instantiated through the project via the LayerConfig.
##### Config Values
 - lowerRange - a lower and upper value for where the amount of blur starts
 - upperRange - a lower and upper value for where the amount of blur ends
 - times - the number of times to blur from lower to upper during the total frame count
 - glitchChance - the percent chance this effect could apply to a given frame

#### Glitch Drumroll Horizontal Wave Effect
Creates an animated glitch for the composite image. Can be glitched to appear on a percentage of the frames generated. Instantiated through the project via the LayerConfig
##### Config Values
 - glitchChance - the percent chance this effect could apply to a given frame
 - glitchOffset - the amount of 'slice' visible
 - glitchOffsetTimes - the number of times to glitch during the total frame count
 - cosineFactor - changes the 'slice'

#### Glitch Fractal Effect
Creates a static glitch for the composite image. Can be glitched to appear on a percentage of the frames generated.
##### Config Values
 - theRandom - the fractal amount
 - glitchChance - the percent chance this effect could apply to a given frame

#### Glitch Inverse Effect
Inverts all colors for the composite image. Can be glitched to appear on a percentage of the frames generated.
##### Config Values
 - glitchChance - the percent chance this effect could apply to a given frame

#### Pixelate Effect
Creates an animated glitch for the composite image. Can be glitched to appear on a percentage of the frames generated.
##### Config Values
 - lowerRange - a lower and upper value for where the amount of pixelate starts
 - upperRange - a lower and upper value for where the amount of pixelate ends 
 - times - the number of times to pixelate from lower to upper during the total frame count
 - glitchChance - the percent chance this effect could apply to a given frame

### Primary Effects
Primary effects are single layer effects. Primary effects are composited into the final image based on the order that they are added to the primary effect array of the project class.

#### Amp Effect
Creates a wheel of 'rays' based on the sparsity factor that spins based on the speed.
##### Config Values
 - invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - underLayerOpacity - the opacity of the bottom, fuzzy, layer
 - sparsityFactor - Array: Randomly picks from the array to draw a 'ray' every X angle
 - stroke - the weight of the outer ray
 - thickness - the weight of the inner ray
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 - speed - Range: spin this amount of angle
 - length - Length of the line to draw
 - lineStart - From the center, where to start the line
 - center - Where the center of the amp is in the overall composition
 - innerColor - ColorPicker: the color for the thickness
 - outerColor - ColorPicker: the color for the stroke and accent

#### BlinkOn Effect
Creates layers of blink.png. Each blink can have the colors randomized and a glow effect applied
##### Config Values
 - layerOpacity - The opacity of each blink
 - numberOfBlinks - Range: the number of blinks to layer
 - initialRotation - Range: rotate the blink x angle
 - rotationSpeedRange - Range: how many times to rotate the blink over the number of frames
 - diameterRange - PercentageRange: the diameter range for each blink
 - glowLowerRange - Range: lower glow range
 - glowUpperRange - Range: upper glow range
 - glowTimes - Range: number of times to glow over the number of frames
 - randomizeSpin - Range: hue spin
 - randomizeRed - Range: increase or decrease the red
 - randomizeBlue - Range: increase or decrease the blue 
 - randomizeGreen - Range: increase or decrease the green

#### Encircled Spiral Effect
Creates N spirals based on the sequence and number of rings
##### Config Values
 - invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - underLayerOpacity - the opacity of the bottom, fuzzy, layer
 - numberOfRings - Range: Number of rings to generate
 - stroke - the weight of the outer ring
 - thickness - the weight of the inner ring
 - sparsityFactor - Array: spokes generated on angle
 - sequencePixelConstant - PercentageRange: the pixel translation of the individual sequence.  1 sequence equals sequencePixelConstant
 - sequence - Array: the sequence to follow when generating the spiral
 - minSequenceIndex - Array: where to start drawing the sequence
 - numberOfSequenceElements: Array: how many sequence elements to draw past the minSequenceIndex
 - speed: Range: the number of times to rotate between sparsity factors
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames
 - center - Point2D: Where the center is in the overall composition
 - innerColor - ColorPicker: the color for the thickness
 - outerColor - ColorPicker: the color for the stroke and accent

#### Fuzz Flare Effect
Creates a lens flare with the ability to add fuzz

##### Config Values
 - invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 - innerColor - ColorPicker: the color for the thickness
 - outerColor - ColorPicker: the color for the stroke and accent
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - center - Point2D: Where the center is in the overall composition
 - underLayerOpacityRange - the opacity of the bottom, fuzzy, layer
 - underLayerOpacityTimes - the number of times to move through the underlay opacity range over the number of frames
 - elementGastonMultiStep Array of MultiStepDefinitionConfig - experimental
 - numberOfFlareRings = Range: number of rings to draw,
 - flareRingsSizeRange = PercentageRange: the range to draw the rings within,
 - flareRingStroke = Range: the stroke to apply to the rings,
 - flareRingThickness = Range: the thickness of the rings,
 - numberOfFlareRays = Range: the number of rays to draw
 - flareRaysSizeRange = PercentageRange: how long the rays should be,
 - flareRaysStroke = Range: the stroke to apply to the rays,
 - flareRayThickness = Range: the thickness of the rays,
 - flareOffset = PercentageRange: the radius from the center to start drawing the rays,
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames

#### Fuzzy Band Effect
Creates a set of rings with fuzz

##### Config Values
 - outerColor - ColorPicker: the color for the stroke and accent
 - innerColor - ColorPicker: the color for the thickness
 - invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - center - Point2D: Where the center is in the overall composition
 - underLayerOpacityRange - the opacity of the bottom, fuzzy, layer
 - underLayerOpacityTimes - the number of times to move through the underlay opacity range over the number of frames
 - circles = Range: the number of circles to draw
 - stroke = the stroke to apply to the bands
 - thickness = the thickness of the bands
 - radius = PercentageRange: the range to draw the circles in
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames

#### Fuzzy Ripples Effect
Creates a set of six outer rings, connected by a hexagon, with a larger set of rings generated from the center, with fuzz

##### Config Values
 - invertLayers - False: fuzzy layer composites on the bottom, True: fuzzy layer composites over the top
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - underLayerOpacity - the opacity of the bottom, fuzzy, layer
 - stroke = the stroke to apply to the drawing
 - thickness = the thickness of the drawing
 - center - Point2D: Where the center is in the overall composition
 - innerColor - ColorPicker: the color for the thickness
 - outerColor - ColorPicker: the color for the stroke and accent
 - largeRadius = PercentageRange: the radius of the center circles,
 - smallRadius = PercentageRange: the radius of the six outer circles
 - largeNumberOfRings = Range: number of large rings,
 - smallNumberOfRings = Range: number of smaller rings in each set,
 - ripple = PercentageRange: amount to expand and then contract,
 - times = Range: number of times to ripple,
 - smallerRingsGroupRadius = PercentageRange: the radius of the outer six circles and the outer point of the hexagon,
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames

#### Gates Effect
Creates number of polygons with fuzz

##### Config Values
 - layerOpacity - the opacity of the top, non-fuzzy, layer
 - underLayerOpacity - the opacity of the bottom, fuzzy, layer
 - center - Point2D: Where the center is in the overall composition
 - gates - Range: number of polygons to draw
 - numberOfSides  - Range: the type of polygon to draw
 - innerColor - ColorPicker: the color for the thickness
 - outerColor - ColorPicker: the color for the stroke and accent
 - thickness = the thickness of the polygon
 - stroke = the stroke to apply to the polygon
 - accentRange - Dynamic Range: the weight to oscillate the fuzzy layer over the total frames by the number of feather times
 - blurRange - Dynamic Range: the amount of blur to apply to the fuzzy layer over the total frames by the number of feather times
 - featherTimes - Range: the number of times to apply the accent range and blur range over the total number of frames


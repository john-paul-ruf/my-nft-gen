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
          effect: RedEyeEffect,  //Effect to apply
          percentChance: 100,  //Percent chance it will be in the generated loop. 100 guarantees effect
          currentEffectConfig: new RedEyeConfig({  //The config for the effect
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







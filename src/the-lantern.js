import {Project} from "./app/Project.js";
import {NeonColorScheme, NeonColorSchemeFactory} from "./core/color/NeonColorSchemeFactory.js";
import {LayerConfig} from "./core/layer/LayerConfig.js";
import {FuzzyBandEffect} from "./effects/primaryEffects/fuzzyBands/FuzzyBandEffect.js";
import {FuzzyBandConfig} from "./effects/primaryEffects/fuzzyBands/FuzzyBandConfig.js";
import {ColorPicker} from "./core/layer/configType/ColorPicker.js";
import {EncircledSpiralEffect} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralEffect.js";
import {EncircledSpiralConfig} from "./effects/primaryEffects/encircledSpiral/EncircledSpiralConfig.js";
import {Point2D} from "./core/layer/configType/Point2D.js";
import {Color} from "three";

const promiseArray = [];

const createLantern = async (color) =>{

    const myTestProject = new Project({
        artist: 'John Ruf',
        projectName: 'the-lantern',
        projectDirectory: "src/the-lantern/",
        neutrals: ['#FFFFFF'],
        backgrounds: ['#000000']
    });

    const length = 1080/7;
    const seq= 5;
    const sparsity = 36;
    const minSeq = 7

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: FuzzyBandEffect,
            percentChance: 100,
            currentEffectConfig: new FuzzyBandConfig({
                layerOpacity: 0.1,
                underLayerOpacityRange: {bottom: {lower: 0.1, upper: 0.2}, top: {lower: 0.3, upper: 0.4}},
                underLayerOpacityTimes: {lower: 2, upper: 6},
                color: new ColorPicker(),
                innerColor: new ColorPicker(ColorPicker.SelectionType.color, '#FFFFFF'),
                invertLayers: true,
                thickness: 1,
                circles: {lower: 10, upper: 10},
                radius: {
                    lower: (finalSize) => finalSize.shortestSide * 0.1,
                    upper: (finalSize) => finalSize.longestSide * 0.55
                },
                accentRange: {bottom: {lower: 6, upper: 12}, top: {lower: 35, upper: 75}},
                blurRange: {bottom: {lower: 1, upper: 3}, top: {lower: 8, upper: 12}},
                featherTimes: {lower: 8, upper: 8},
            }),
            defaultEffectConfig: FuzzyBandConfig
        })
    });

//row one
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2),(1920/2)+(2*length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

//row two
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)-(length),(1920/2)+(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2),(1920/2)+(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)+(length),(1920/2)+(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

//row three
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)-(2*length),(1920/2)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)-length,(1920/2)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2),(1920/2)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)+length,(1920/2)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)+(2*length),(1920/2)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

//row four
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)-(length),(1920/2)-(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2),(1920/2)-(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2)+(length),(1920/2)-(length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

//row five
    await myTestProject.addPrimaryEffect({
        layerConfig: new LayerConfig({
            effect: EncircledSpiralEffect,
            percentChance: 100,
            currentEffectConfig: new EncircledSpiralConfig({
                outerColor: color,
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.5,
                startAngle: {lower: 0, upper: 360},
                numberOfRings: {lower: 2, upper: 2},
                stroke: 1,
                thickness: 2,
                sparsityFactor: [sparsity],
                sequencePixelConstant: {
                    lower: (finalSize) => finalSize.shortestSide * 0.001,
                    upper: (finalSize) => finalSize.shortestSide * 0.001
                },
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
                minSequenceIndex: [minSeq],
                numberOfSequenceElements: [seq],
                speed: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                featherTimes: {lower: 2, upper: 4},
                //center
                center: new Point2D((1080/2),(1920/2)-(2*length)),
            }),
            defaultEffectConfig: EncircledSpiralConfig
        })
    });

    myTestProject.colorScheme = NeonColorSchemeFactory.getColorScheme(NeonColorScheme.neons);

    promiseArray.push(myTestProject.generateRandomLoop());
}

await createLantern(new ColorPicker(ColorPicker.SelectionType.color, '#00FF00'));
await createLantern(new ColorPicker(ColorPicker.SelectionType.color, '#FFFF00'));
await createLantern(new ColorPicker(ColorPicker.SelectionType.color, '#0000FF'));



Promise.all(promiseArray);
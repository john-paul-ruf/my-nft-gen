import {EffectConfig} from "../../EffectConfig.js";

export class GatesConfig extends EffectConfig {
    constructor(
        {
            layerOpacity = 1,
            underLayerOpacity = 0.5,
            gates = {lower: 1, upper: 3},
            numberOfSides = {lower: 4, upper: 4},
            thickness = 24,
            stroke = 0,
            accentRange = {bottom: {lower: 2, upper: 5}, top: {lower: 10, upper: 15}},
            blurRange = {bottom: {lower: 1, upper: 2}, top: {lower: 3, upper: 4}},
            featherTimes = {lower: 2, upper: 4}
        }
    ) {
        super();
        this.layerOpacity = layerOpacity;
        this.underLayerOpacity = underLayerOpacity;
        this.gates = gates;
        this.numberOfSides = numberOfSides;
        this.stroke = stroke;
        this.thickness = thickness;
        this.accentRange = accentRange;
        this.blurRange = blurRange;
        this.featherTimes = featherTimes;
    }
}
import { EffectConfig } from '../../../core/layer/EffectConfig.js';

export class ThreeDimensionalShapeConfig extends EffectConfig {
    constructor(
        {
            times = { lower: 1, upper: 2 },
            counterClockwise = { lower: 0, upper: 1 },
        },
    ) {
        super();
        this.times = times;
        this.counterClockwise = counterClockwise;
    }
}

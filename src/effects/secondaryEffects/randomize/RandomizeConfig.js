import { EffectConfig } from 'my-nft-gen';

export class RandomizeConfig extends EffectConfig {
    constructor(
        {
            spin = { lower: -8, upper: 8 },
            red = { lower: -8, upper: 8 },
            blue = { lower: -8, upper: 8 },
            green = { lower: -8, upper: 8 },
        },
    ) {
        super();
        this.spin = spin;
        this.red = red;
        this.blue = blue;
        this.green = green;
    }
}

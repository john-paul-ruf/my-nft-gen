import {applySecondaryEffects} from "./generateEffect.js";


///////////////////////////////////////////////////////////////
/*
    This class handles all effects inside the animate function

    It allows us to have a generic interface to the actual
    effect classes.

    This means is that we can treat all the effects as if
    they were the same. This is accomplished using the
    strategy pattern.
*/

///////////////////////////////////////////////////////////////
export class Effect {

    constructor(card, settings) {
        this.invoke = card.effect.invoke; //the effect to call
        this.settings = settings;

        this.additionalEffects = []
        this.card = card;
        if (this.card.requiresLayer) {  //Does this effect qualify for additional effects?
            if (!this.card.ignoreAdditionalEffects) {
                this.additionalEffects = applySecondaryEffects()  //Then pile them on
            }
        }
    }

    async init() {
        //the effect, instantiated
        this.data = await this.card.generateData(this.settings);
    }

    async invokeEffect(layer, currentFrame, totalFrames) {
        await this.invoke(layer, this.data, currentFrame, totalFrames) //execute the effect
        for (let i = 0; i < this.additionalEffects.length; i++) {
            //if any additional effects? call them as well.
            if (!this.card.ignoreAdditionalEffects) {
                await this.additionalEffects[i].invoke(layer, this.additionalEffects[i].data, currentFrame, totalFrames);
            }
        }
    }

    getInfo() { //Gets the effect's info for the artist card output
        return this.data.getInfo();
    }
}
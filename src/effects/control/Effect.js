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

    constructor(card) {
        this.invoke = card.effect.invoke; //the effect to call
        this.data = card.generateData(); //the effect, instantiated
        this.additionalEffects = []
        this.card = card;
        if (card.requiresLayer) {  //Does this effect qualify for additional effects?
            this.additionalEffects = applySecondaryEffects()  //Then pile them on
        }
    }

    async invokeEffect(layer, currentFrame, totalFrames) {
        await this.invoke(this.data, layer, currentFrame, totalFrames) //execute the effect
    }

    getInfo() { //Gets the effect's info for the artist card output
        return this.data.getInfo();
    }
}
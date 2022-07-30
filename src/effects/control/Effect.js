import {generateEffects} from "./generateEffect.js";
import {secondaryEffects} from "./possibleEffects.js";


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
            this.additionalEffects = generateEffects(secondaryEffects, card.allowsRotation)  //Then pile them on
        }
    }

    async invokeEffect(img, currentFrame, totalFrames) {
        await this.invoke(this.data, img, currentFrame, totalFrames, this.card) //execute the effect
        for (let i = 0; i < this.additionalEffects.length; i++) {
            //if any additional effects? call them as well.
            await this.additionalEffects[i].invoke(this.additionalEffects[i].data, img, currentFrame, totalFrames, this.card)
        }
    }

    getInfo() { //Gets the effect's info for the artist card output
        return this.data.getInfo();
    }
}
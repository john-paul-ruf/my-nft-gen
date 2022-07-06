import {generateEffects} from "./generateEffect.js";
import {possibleAdditionalEffects} from "./possibleEffects.js";




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

    constructor(name, invokeStrategy, data, requiresLayer) {
        this.invoke = invokeStrategy.invoke; //the effect to call
        this.data = data; //the effect, instantiated
        this.data.name = name;
        this.additionalEffects = []
        if (requiresLayer) {  //Does this effect qualify for additional effects?
            this.additionalEffects = generateEffects(possibleAdditionalEffects)  //Then pile them on
        }
    }

    async invokeEffect(img, currentFrame, totalFrames) {
        await this.invoke(this.data, img, currentFrame, totalFrames) //execute the effect
        for (let i = 0; i < this.additionalEffects.length; i++) {
            //if any additional effects? call them as well.
            await this.additionalEffects[i].invoke(this.additionalEffects[i].data, img, currentFrame, totalFrames)
        }
    }

    getInfo(){ //Gets the effect's info for the artist card output
        return this.data.getInfo();
    }
}
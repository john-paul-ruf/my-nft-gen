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

    constructor(card, settings, ignoreAdditionalEffects, additionalEffects) {
        this.invoke = card.effect.invoke; //the effect to call
        this.ignoreAdditionalEffects = ignoreAdditionalEffects;
        this.additionalEffects = additionalEffects;
        this.card = card;
    }

    async init(settings) {
        //the effect, instantiated
        this.data = await this.card.generateData(settings);
        for (let i = 0; i < this.additionalEffects.length; i++) {
            await this.additionalEffects[i].init();
        }
    }

    async invokeEffect(layer, currentFrame, totalFrames) {
        await this.invoke(layer, this.data, currentFrame, totalFrames) //execute the effect
        for (let i = 0; i < this.additionalEffects.length; i++) {
            //if any additional effects? call them as well.
            if (!this.ignoreAdditionalEffects) {
                await this.additionalEffects[i].invoke(layer, this.additionalEffects[i].data, currentFrame, totalFrames);
            }
        }
    }

    getInfo() { //Gets the effect's info for the artist card output
        return this.data.getInfo();
    }
}
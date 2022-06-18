import {generateEffects} from "./generateEffect.js";
import {possibleAdditionalEffects} from "./possibleEffects.js";

export class Effect {

    constructor(name, invokeStrategy, data, requiresLayer) {
        this.invoke = invokeStrategy.invoke;
        this.data = data;
        this.data.name = name;
        this.additionalEffects = []
        if (requiresLayer) {
            this.additionalEffects = generateEffects(possibleAdditionalEffects)
        }
    }

    async invokeEffect(img, currentFrame, totalFrames) {
        await this.invoke(this.data, img, currentFrame, totalFrames)
        for (let i = 0; i < this.additionalEffects.length; i++) {
            await this.additionalEffects[i].invoke(this.additionalEffects[i].data, img, currentFrame, totalFrames)
        }
    }

    getInfo(){
        return this.data;
    }
}
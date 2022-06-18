import {generateEffects} from "./generateEffect.js";
import {glowEffect} from "../glow.js";
import {randomizeEffect} from "../randomize.js";
import {fadeEffect} from "../fade.js";
import {rotateEffect} from "../rotate.js";
import {animateBackgroundEffect} from "../animateBackground.js";
import {verticalScanLinesEffect} from "../verticalScanLines.js";

export class Effect {

    constructor(name, invokeStrategy, data, requiresLayer) {
        this.invoke = invokeStrategy.invoke;
        this.data = data;
        this.data.name = name;
        this.additionalEffects = []
        if (requiresLayer) {
            this.additionalEffects = generateEffects([
                randomizeEffect,
                glowEffect,
                fadeEffect,
            ])
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
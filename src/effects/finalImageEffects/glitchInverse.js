const config = {}

const generate = () => {

    const data = {
        getInfo: () => {
            return `${glitchInverseEffect.name}`
        }
    }
    return data;
}

const glitchInverse = async (data, img, currentFrame, totalFrames, card) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/inverse.js
    /////////////////////
    for (let i = 0; i < img.bitmap.data.length; i++) {
        img.bitmap.data[i] = ~img.bitmap.data[i] | 0xFF000000;
    }
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => glitchInverse(data, img, currentFrame, totalFrames, card)
}

export const glitchInverseEffect = {
    name: 'glitch inverse',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



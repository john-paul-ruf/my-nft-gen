const config = {}

const generate = () => {

    const data = {
        getInfo: () => {
            return `${glitchFractalEffect.name}`
        }
    }
    return data;
}

const glitchFractal = async (data, img, currentFrame, totalFrames, card) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/fractal.js
    /////////////////////
    for (let i = img.bitmap.data.length; i; i--) {
        if (parseInt(img.bitmap.data[(i * 2) % img.bitmap.data.length], 10) < parseInt(img.bitmap.data[i], 10)) {
            img.bitmap.data[i] = img.bitmap.data[(i * 2) % img.bitmap.data.length];
        }
    }
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => glitchFractal(data, img, currentFrame, totalFrames, card)
}

export const glitchFractalEffect = {
    name: 'glitch fractal',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



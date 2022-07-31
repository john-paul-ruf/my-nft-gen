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
    function randRange(a, b) {
        return Math.round(Math.random() * b) + a;
    }

    let m = randRange(2, 8);
    for (let j = 0; j < img.bitmap.data.length; j++) {
        if (parseInt(img.bitmap.data[(j * m) % img.bitmap.data.length], 10) < parseInt(img.bitmap.data[j], 10)) {
            img.bitmap.data[j] = img.bitmap.data[(j * m) % img.bitmap.data.length];
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
    effectChance: 100,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



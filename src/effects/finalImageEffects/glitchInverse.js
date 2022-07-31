const generate = () => {
    return {
        getInfo: () => {
            return `${glitchInverseEffect.name}`
        }
    };
}

const glitchInverse = async (data, img) => {
    /////////////////////
    // https://github.com/JKirchartz/Glitchy3bitdither/blob/master/source/glitches/inverse.js
    /////////////////////
    const imgData = new Uint32Array(img.bitmap.data);
    for (let i = 0; i < data.length; i++) {
        imgData[i] = ~imgData[i] | 0xFF000000;
    }
    img.bitmap.data = new Buffer(imgData);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => glitchInverse(data, img, currentFrame, totalFrames)
}

export const glitchInverseEffect = {
    name: 'glitch inverse',
    generateData: generate,
    effect: effect,
    effectChance: 20,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



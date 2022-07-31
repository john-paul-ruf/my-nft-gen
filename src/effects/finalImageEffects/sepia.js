const generate = () => {
    return {
        getInfo: () => {
            return `${sepiaEffect.name}`
        }
    };
}

const sepia = async (data, img) => {
    await img.sepia();
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => sepia(data, img, currentFrame, totalFrames)
}

export const sepiaEffect = {
    name: 'sepia',
    generateData: generate,
    effect: effect,
    effectChance: 5, //not a fan
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



const config = {}

const generate = () => {

    const data =
        {
            getInfo: () => {
                return `${sepiaEffect.name}`
            }
        }
    return data;
}

const sepia = async (data, img, currentFrame, totalFrames, card) => {
    await img.sepia();
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => sepia(data, img, currentFrame, totalFrames, card)
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



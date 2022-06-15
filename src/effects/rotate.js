export const rotate = async (img, numberOfRotations, currentFrame, totalFrame) => {
    return await img.rotate((((360 * numberOfRotations)/totalFrame)*currentFrame), false);
}

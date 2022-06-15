import Jimp from "jimp";
export const animateBackground = async (width, height, color1 = '#06040A', color2 = '#1f1f1f', color3 = '#016236') => {

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    let img = new Jimp(width, height);

    for (let x = 0; x < 3000; x++) {
        for (let y = 0; y < 3000; y++) {
            const rando = getRandomInt(0, 20)
            if (rando < 15) {
                await img.setPixelColor(Jimp.cssColorToHex(color1), x, y)
            } else if (rando < 18) {
                await img.setPixelColor(Jimp.cssColorToHex(color2), x, y)
            } else {
                await img.setPixelColor(Jimp.cssColorToHex(color3), x, y)
            }
        }
    }

    await img.blur(1)

    return img;
}
import Jimp from "jimp";
export const verticalScanLines = async (width, height, lineInfo, currentFrame, numberOfFrames) => {

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    let img = new Jimp(width,height);

    const drawLine = async (y, maxTrailLength, pixelsPerGradient) => {
        for (let x = 0; x < 3000; x++) {
            let rando = getRandomInt(y, y - maxTrailLength)
            for (let curY = y; curY >= rando; curY--) {

                let hex = '#bdf379';
                let upperRange = 3;
                let gradientGroup = (curY-rando) / pixelsPerGradient;
                hex = hex + getRandomInt(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)
                    + getRandomInt(gradientGroup < 16 ? gradientGroup : 16, gradientGroup + upperRange < 16 ? gradientGroup + upperRange : 16).toString(16)

                let color = Jimp.cssColorToHex(hex)
                await img.setPixelColor(color, x, curY)
            }
        }
    }

    for (let i = 0; i < lineInfo.length; i++) {
        const displacement = (height / numberOfFrames) * currentFrame;
        let y = lineInfo[i].lineStart + displacement;

        if (y > height) {
            y = y - height
        }

        await drawLine(y, lineInfo[i].maxTrailLength, lineInfo[i].pixelsPerGradient)
    }

    return img;

}

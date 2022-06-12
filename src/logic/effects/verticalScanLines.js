import Jimp from "jimp";
export const verticalScanLines = async (width, height, lineInfo, maxTrailLength, pixelsPerGradient, currentFrame, numberOfFrames) => {

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    let img = new Jimp(width,height);

    const drawLine = async (y) => {
        for (let x = 0; x < 3000; x++) {
            let rando = getRandomInt(y, y - maxTrailLength)
            for (let curY = y; curY >= rando; curY--) {

                let hex = '#bdf379';
                let upperRange = 3;
                let gradientGroup = curY / pixelsPerGradient;
                hex = hex + getRandomInt(gradientGroup < 10 ? gradientGroup : 10, gradientGroup + upperRange < 10 ? gradientGroup + upperRange : 10).toString()
                    + getRandomInt(gradientGroup < 10 ? gradientGroup : 10, gradientGroup + upperRange < 10 ? gradientGroup + upperRange : 10).toString()

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

        await drawLine(y)
    }

    return img;

}

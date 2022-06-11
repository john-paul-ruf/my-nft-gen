const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const {GifFrame, GifUtil, GifCodec, BitmapImage} = require('gifwrap');
const {contrast} = require("jimp");


const main = async (index) => {

    const controlPlane = {};

    const getFilesInDirectory = (dir) => {

        const directoryPath = path.join(__dirname, dir);
        const list = [];

        fs.readdirSync(directoryPath).forEach(file => {
            list.push(file);
        });

        return list;
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
    const getRandomArbitrary = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const imageOverlay = async (focusFile, summonsFile) => {
        console.log(controlPlane);

        controlPlane.startTime = new Date();

        const frames = [];

        const rotateSummons = async (degree) => {
            const findValue = (min, max, currentFrame) => {
                const range = max - min;
                const step = range / (180);

                if (currentFrame <= 180) {
                    return min + (step * currentFrame);
                }

                return max - (step * (currentFrame - 180));
            }

            const glow = async (img, degree, effectProps) => {
                if (effectProps.doGlow > 0) {
                    const hue = findValue(effectProps.glowLowerRange, effectProps.glowUpperRange, degree)
                    await img.color([{apply: 'hue', params: [hue]}]);
                }

                return img;
            }

            const fade = async (img, degree, effectProps) => {
                if (effectProps.doFade > 0) {
                    const opacity = findValue(effectProps.fadeLowerRange, effectProps.fadeUpperRange, degree)
                    await img.opacity(opacity);
                }

                return img;
            }

            const animateBackground = async () => {

                const gray = Jimp.cssColorToHex('#06040A')
                const darkGreen = Jimp.cssColorToHex('#1f1f1f')
                const green = Jimp.cssColorToHex('#016236')

                let img = new Jimp(3000, 3000, gray);

                for (let x = 0; x < 3000; x++) {
                    for (let y = 0; y < 3000; y++) {
                        const rando = getRandomInt(0, 20)
                        if (rando < 15) {
                            img.setPixelColor(gray, x, y)
                        } else if (rando < 18) {
                            img.setPixelColor(darkGreen, x, y)
                        } else {
                            img.setPixelColor(green, x, y)
                        }
                    }
                }

                img.blur(1)

                return img;

            }

            let bg = await animateBackground();
            let summons = await Jimp.read(summonsFile);
            let focus = await Jimp.read(focusFile);

            await summons.color(controlPlane.summonsProps);
            await summons.rotate(degree, false);

            await focus.color(controlPlane.focusProps);

            summons = await glow(summons, degree, controlPlane.summonEffectProps);
            summons = await fade(summons, degree, controlPlane.summonEffectProps);

            focus = await glow(focus, degree, controlPlane.focusEffectProps);
            focus = await fade(focus, degree, controlPlane.focusEffectProps);

            await bg.composite(summons, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await bg.composite(focus, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            });

            GifUtil.quantizeDekker(bg, controlPlane.colorDepth)

            let frame = new GifFrame(new BitmapImage(bg.bitmap));
            frames.push(frame);
        }

        for (let degree = 0; degree < controlPlane.numberOfDegrees; degree = degree + controlPlane.degreeInc) {

            const timeLeft = () => {
                let currentTime = new Date();
                let rez = currentTime.getTime() - controlPlane.startTime.getTime();
                let currentFrameCount = (degree / controlPlane.degreeInc)
                let timePerFrame = rez / currentFrameCount;
                let timeLeft = (controlPlane.numberOfFrame - currentFrameCount) * timePerFrame;

                let h = Math.trunc(timeLeft / 3600000 % 100).toString().padStart(2, '0');
                let m = Math.trunc(timeLeft / 60000 % 60).toString().padStart(2, '0');
                let s = Math.trunc(timeLeft / 1000 % 60).toString().padStart(2, '0');
                let ms = Math.trunc(timeLeft % 1000).toString().padStart(3, '0');
                console.log(h + ':' + m + ':' + s + '.' + ms);
            }

            console.log("started " + degree.toString() + " degree");
            await rotateSummons(degree);
            timeLeft();
            console.log("completed " + degree.toString() + " degree");
        }

        controlPlane.endTime = new Date();

        let rez = controlPlane.endTime.getTime() - controlPlane.startTime.getTime();
        let h = Math.trunc(rez / 3600000 % 100).toString().padStart(2, '0');
        let m = Math.trunc(rez / 60000 % 60).toString().padStart(2, '0');
        let s = Math.trunc(rez / 1000 % 60).toString().padStart(2, '0');
        let ms = Math.trunc(rez % 1000).toString().padStart(3, '0');
        controlPlane.processingTime = (h + ':' + m + ':' + s + '.' + ms);

        console.log("gif " + index.toString() + " write start");
        console.log(controlPlane);

        fs.writeFileSync(controlPlane.fileOut + '.txt', JSON.stringify(controlPlane, null, 2), 'utf-8');

        GifUtil.write(controlPlane.fileOut, frames).then(gif => {
            console.log("gif " + index.toString() + " written");
        });

    }

    const summonsList = getFilesInDirectory('/img/png/summons/png')
    const focusList = getFilesInDirectory('/img/png/focus/png')

    controlPlane.summonsName = summonsList[getRandomInt(0, summonsList.length - 1)];
    controlPlane.focusName = focusList[getRandomInt(0, focusList.length - 1)];

    const summons = path.join(__dirname, '/img/png/summons/png/' + controlPlane.summonsName)
    const focus = path.join(__dirname, '/img/png/focus/png/' + controlPlane.focusName)
    controlPlane.fileOut = path.join(__dirname, '/img/output/' + Date.now().toString() + '.gif')

    controlPlane.summonsProps = [
        {apply: 'hue', params: [getRandomInt(-90, 90)]},
        {apply: 'red', params: [getRandomInt(0, 5)]},
        {apply: 'green', params: [getRandomInt(0, 5)]},
        {apply: 'blue', params: [getRandomInt(0, 5)]},
    ]

    controlPlane.focusProps = [
        {apply: 'hue', params: [getRandomInt(-90, 90)]},
        {apply: 'red', params: [getRandomInt(0, 5)]},
        {apply: 'green', params: [getRandomInt(0, 5)]},
        {apply: 'blue', params: [getRandomInt(0, 5)]},
    ]

    controlPlane.summonEffectProps = {
        glowLowerRange: getRandomInt(0, 30),
        glowUpperRange: getRandomInt(60, 90),
        doGlow: getRandomInt(0, 5),

        fadeLowerRange: getRandomArbitrary(0.7, 0.8),
        fadeUpperRange: getRandomArbitrary(0.85, 1),
        doFade: getRandomInt(0, 5),
    }

    controlPlane.focusEffectProps = {
        glowLowerRange: getRandomInt(0, 30),
        glowUpperRange: getRandomInt(60, 90),
        doGlow: getRandomInt(0, 5),

        fadeLowerRange: getRandomArbitrary(0.7, 0.8),
        fadeUpperRange: getRandomArbitrary(0.85, 1),
        doFade: getRandomInt(0, 5),
    }

    controlPlane.colorDepth = 255;
    controlPlane.degreeInc = 2;
    controlPlane.numberOfDegrees = 360;
    controlPlane.numberOfFrame = controlPlane.numberOfDegrees / controlPlane.degreeInc;

    await imageOverlay(focus, summons)

    if (index <= 50) {
        index = index + 1;
        console.log("started " + index.toString() + " process");
        main(index);
        console.log("completed " + index.toString() + " process");
    }
}

let index = 1
main(index);



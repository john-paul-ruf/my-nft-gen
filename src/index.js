const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const {GifFrame, GifUtil, GifCodec, BitmapImage} = require('gifwrap');


const main = async (index) => {

    const controlPlane = {
        _INVOKED_: 'John Ruf - Bookstore Illuminati',
        hueRange: {
            lower: -360,
            upper: 360
        },
        glowLowerRange: {
            lower: -360,
            upper: 0
        },
        glowUpperRange: {
            lower: 0,
            upper: 360
        },
        fadeLowerRange: {
            lower: 0.5,
            upper: 0.75
        },
        fadeUpperRange: {
            lower: 0.75,
            upper: 1
        },
        verticalScanLine: {
            numberOfLineLower: 4,
            numberOfLinesUpper: 8,
            trailsLengthLower: 5,
            trailsLengthUpper: 50
        },
        effectChance: 50
    };

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

    const doEffect = (chance) => {
        const result = getRandomInt(0, 100)
        return result <= chance;
    }

    const imageOverlay = async (focusFile, summonsFile) => {
        console.log(controlPlane);

        controlPlane.startTime = new Date();

        const frames = [];

        const rotateSummons = async (degree) => {
            const findValue = (min, max, currentFrame) => {
                const range = max - min;
                const step = range / (controlPlane.halfWayNumberOfDegrees);

                if (currentFrame <= controlPlane.halfWayNumberOfDegrees) {
                    return min + (step * currentFrame);
                }

                return max - (step * (currentFrame - controlPlane.halfWayNumberOfDegrees));
            }

            const glow = async (img, degree, effectProps) => {
                if (effectProps.doGlow) {
                    const hue = findValue(effectProps.glowLowerRange, effectProps.glowUpperRange, degree)
                    await img.color([{apply: 'hue', params: [hue]}]);
                }

                return img;
            }

            const fade = async (img, degree, effectProps) => {
                if (effectProps.doFade) {
                    const opacity = findValue(effectProps.fadeLowerRange, effectProps.fadeUpperRange, degree)
                    await img.opacity(opacity);
                }

                return img;
            }

            const animateBackground = async () => {

                if(controlPlane.animateBackground.doAnimateBackground) {
                    const gray = Jimp.cssColorToHex('#06040A')
                    const darkGreen = Jimp.cssColorToHex('#1f1f1f')
                    const green = Jimp.cssColorToHex('#016236')

                    let img = new Jimp(controlPlane.finalImageSize, controlPlane.finalImageSize, gray);

                    for (let x = 0; x < 3000; x++) {
                        for (let y = 0; y < 3000; y++) {
                            const rando = getRandomInt(0, 20)
                            if (rando < 15) {
                                await img.setPixelColor(gray, x, y)
                            } else if (rando < 18) {
                                await img.setPixelColor(darkGreen, x, y)
                            } else {
                                await img.setPixelColor(green, x, y)
                            }
                        }
                    }

                    await img.blur(1)

                    return img;
                }

                return new Jimp(controlPlane.finalImageSize, controlPlane.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));

            }

            const verticalScanLines = async () => {
                if(controlPlane.verticalScanEffectProps.doVerticalScanLines) {

                    let img = new Jimp(controlPlane.finalImageSize, controlPlane.finalImageSize);
                    const drawLine = async (y) => {
                        for (let x = 0; x < 3000; x++) {
                            let rando = getRandomInt(y, y - controlPlane.verticalScanEffectProps.maxTrailLength)
                            for (let curY = y; curY >= rando; curY--) {

                                let hex = '#bdf379';
                                let upperRange = 3;
                                let gradientGroup = curY / controlPlane.verticalScanEffectProps.pixelsPerGradient;
                                hex = hex + getRandomInt(gradientGroup < 10 ? gradientGroup : 10, gradientGroup+upperRange < 10 ? gradientGroup+upperRange: 10).toString()
                                    + getRandomInt(gradientGroup < 10 ? gradientGroup : 10, gradientGroup+upperRange < 10 ? gradientGroup+upperRange: 10).toString()

                                let color = Jimp.cssColorToHex(hex)
                                await img.setPixelColor(color, x, curY)
                            }
                        }
                    }

                    for (let i = 0; i < controlPlane.verticalScanEffectProps.lineInfo.length; i++) {
                        const displacement = (controlPlane.finalImageSize / controlPlane.numberOfDegrees) * degree;
                        let y = controlPlane.verticalScanEffectProps.lineInfo[i].lineStart + displacement;

                        if (y > controlPlane.finalImageSize) {
                            y = y - controlPlane.finalImageSize
                        }

                        await drawLine(y)
                    }

                    await bg.composite(img, 0, 0, {
                        mode: Jimp.BLEND_SOURCE_OVER,
                    })

                }

            }

            let summons = await Jimp.read(summonsFile);
            let focus = await Jimp.read(focusFile);

            await summons.color(controlPlane.summonsProps);
            await summons.rotate(degree, false);

            await focus.color(controlPlane.focusProps);

            summons = await glow(summons, degree, controlPlane.summonEffectProps);
            summons = await fade(summons, degree, controlPlane.summonEffectProps);

            focus = await glow(focus, degree, controlPlane.focusEffectProps);
            focus = await fade(focus, degree, controlPlane.focusEffectProps);

            let bg = await animateBackground();

            await verticalScanLines();

            await bg.composite(summons, (controlPlane.finalImageSize - 2000) / 2, (controlPlane.finalImageSize - 2000) / 2, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await bg.composite(focus, (controlPlane.finalImageSize - 2000) / 2, (controlPlane.finalImageSize - 2000) / 2, {
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

        controlPlane._bornOn = controlPlane.endTime;

        console.log("gif " + index.toString() + " write start");
        console.log(controlPlane);

        const fileProps = JSON.stringify(controlPlane, null, 2)
        fs.writeFileSync(controlPlane.fileOut + '.txt', fileProps, 'utf-8');

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
        {apply: 'hue', params: [getRandomInt(controlPlane.hueRange.lower, controlPlane.hueRange.upper)]},
        {apply: 'red', params: [getRandomInt(0, 5)]},
        {apply: 'green', params: [getRandomInt(0, 5)]},
        {apply: 'blue', params: [getRandomInt(0, 5)]},
    ]

    controlPlane.focusProps = [
        {apply: 'hue', params: [getRandomInt(controlPlane.hueRange.lower, controlPlane.hueRange.upper)]},
        {apply: 'red', params: [getRandomInt(0, 5)]},
        {apply: 'green', params: [getRandomInt(0, 5)]},
        {apply: 'blue', params: [getRandomInt(0, 5)]},
    ]

    controlPlane.summonEffectProps = {
        glowLowerRange: getRandomInt(controlPlane.glowLowerRange.lower, controlPlane.glowLowerRange.upper),
        glowUpperRange: getRandomInt(controlPlane.glowUpperRange.lower, controlPlane.glowUpperRange.upper),
        doGlow: doEffect(controlPlane.effectChance),

        fadeLowerRange: getRandomArbitrary(controlPlane.fadeLowerRange.lower, controlPlane.fadeLowerRange.upper),
        fadeUpperRange: getRandomArbitrary(controlPlane.fadeUpperRange.lower, controlPlane.fadeUpperRange.upper),
        doFade: doEffect(controlPlane.effectChance),
    }

    controlPlane.focusEffectProps = {
        glowLowerRange: getRandomInt(controlPlane.glowLowerRange.lower, controlPlane.glowLowerRange.upper),
        glowUpperRange: getRandomInt(controlPlane.glowUpperRange.lower, controlPlane.glowUpperRange.upper),
        doGlow: doEffect(controlPlane.effectChance),

        fadeLowerRange: getRandomArbitrary(controlPlane.fadeLowerRange.lower, controlPlane.fadeLowerRange.upper),
        fadeUpperRange: getRandomArbitrary(controlPlane.fadeUpperRange.lower, controlPlane.fadeUpperRange.upper),
        doFade: doEffect(controlPlane.effectChance),
    }

    controlPlane.verticalScanEffectProps = {
        pixelsPerGradient: 3,
        numberOfLines: getRandomInt(controlPlane.verticalScanLine.numberOfLineLower, controlPlane.verticalScanLine.numberOfLinesUpper),
        maxTrailLength: getRandomInt(controlPlane.verticalScanLine.trailsLengthLower, controlPlane.verticalScanLine.trailsLengthUpper),
        doVerticalScanLines: doEffect(controlPlane.effectChance),
        computeInitialLineInfo: (numberOfLines) => {

            const lineInfo = [];

            for (let i = 0; i <= numberOfLines; i++) {
                lineInfo.push({lineStart: getRandomInt(0, controlPlane.finalImageSize)});
            }

            return lineInfo;
        }
    }

    controlPlane.animateBackground = {
        doAnimateBackground: doEffect(controlPlane.effectChance),
    }

    controlPlane.finalImageSize = 3000;
    controlPlane.colorDepth = 255;
    controlPlane.degreeInc = 4;
    controlPlane.numberOfDegrees = 360;
    controlPlane.halfWayNumberOfDegrees = controlPlane.numberOfDegrees / 2;
    controlPlane.numberOfFrame = controlPlane.numberOfDegrees / controlPlane.degreeInc;
    controlPlane.verticalScanEffectProps.lineInfo = controlPlane.verticalScanEffectProps.computeInitialLineInfo(controlPlane.verticalScanEffectProps.numberOfLines);

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



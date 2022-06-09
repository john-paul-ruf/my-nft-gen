const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const { GifFrame, GifUtil, GifCodec, BitmapImage } = require('gifwrap');


const main = async (index) => {
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
    const getRandomArbitrary = (min, max) =>  {
        return Math.random() * (max - min) + min;
    }

    const imageOverlay = async (focusFile, summonsFile, bgFile, outputFile) => {

        let focus = await Jimp.read(focusFile);

        const frames = [];

        const summonsProps = [
            { apply: 'saturate', params: [getRandomInt(0,100)] },
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'red', params: [getRandomInt(0,100)] },
            { apply: 'green', params: [getRandomInt(0,100)] },
            { apply: 'blue', params: [getRandomInt(0,100)] },
        ]

        const focusProps = [
            { apply: 'saturate', params: [getRandomInt(0,100)] },
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'red', params: [getRandomInt(0,100)] },
            { apply: 'green', params: [getRandomInt(0,100)] },
            { apply: 'blue', params: [getRandomInt(0,100)] },
        ]

        const popGlowProps = {
            glowLowerRange: getRandomArbitrary(0, 30),
            glowUpperRange: getRandomArbitrary(70, 100),

            blurLowerRange: getRandomInt(1, 5),
            blurUpperRange: getRandomInt(15, 25),

            fadeLowerRange: getRandomArbitrary(0, 0.2),
            fadeUpperRange: getRandomArbitrary(0.3, 0.4),
        }

        const rotateSummons = async (degree) => {

            const popGLow = async (summons, degree) => {

                const findValue = (min, max, currentFrame) => {

                    const range = max-min;
                    const step = range / (180);

                    if(currentFrame <= 180)
                    {
                        return min + (step * currentFrame);
                    }

                    return  max - (step * (currentFrame - 180));
                }

                const blur = findValue(popGlowProps.blurLowerRange, popGlowProps.blurUpperRange, degree)
                await summons.blur(blur);

                const opacity = findValue(popGlowProps.fadeLowerRange, popGlowProps.fadeUpperRange, degree)
                await summons.opacity(opacity);

                const saturate = findValue(popGlowProps.glowLowerRange, popGlowProps.glowUpperRange, degree)
                await summons.color([{ apply: 'saturate', params: [saturate]}]);
            }

            let bg = new Jimp(3000,3000, 'black');
            let summons = await Jimp.read(summonsFile);

            await summons.color(summonsProps);
            await summons.rotate(degree, false);

            await popGLow(summons, degree);

            await bg.composite(summons, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await bg.composite(focus, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            });

            console.log("started " + degree.toString() + " quantize");
            GifUtil.quantizeDekker(bg, 128)
            console.log("completed " + degree.toString() + " quantize");

            let frame = new GifFrame(new BitmapImage(bg.bitmap));
            frames.push(frame);
        }

        await focus.color(focusProps);

        const degreeInc = 1;
        for(let degree = 1; degree <= 360; degree = degree + degreeInc){
            console.log("started " + degree.toString() + " degree");
            await rotateSummons(degree);
            console.log("completed " + degree.toString() + " degree");
        }

        console.log("gif " + index.toString() + " write start");
        GifUtil.write(outputFile, frames).then(gif => {
            console.log("gif " + index.toString() + " written");
        });

    }

    const summonsList = getFilesInDirectory('/img/png/summons/png')
    const focusList = getFilesInDirectory('/img/png/focus/png')

    const summonsName = summonsList[getRandomInt(0, summonsList.length - 1)];
    const focusName = focusList[getRandomInt(0, focusList.length - 1)];

    const summons = path.join(__dirname, '/img/png/summons/png/' + summonsName)
    const focus = path.join(__dirname, '/img/png/focus/png/' + focusName)
    const bg = path.join(__dirname, '/img/png/backgrounds/Untitled-1.png')
    const fileOut = path.join(__dirname, '/img/output/' + Date.now().toString() + '.gif')

    await imageOverlay(focus, summons, bg, fileOut)


    if (index <= 50) {
        index = index + 1;
        console.log("started " + index.toString() + " process");
        main(index);
        console.log("completed " + index.toString() + " process");
    }
}

let index = 1
main(index);



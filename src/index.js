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

        const frames = [];

        const summonsProps = [
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'saturate', params: [getRandomInt(0,25)] },
            { apply: 'desaturate', params: [getRandomInt(0,25)] },
            { apply: 'red', params: [getRandomInt(0,25)] },
            { apply: 'green', params: [getRandomInt(0,25)] },
            { apply: 'blue', params: [getRandomInt(0,25)] },
        ]
        console.log('summonsProps: ');
        console.log(summonsProps);

        const focusProps = [
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'saturate', params: [getRandomInt(0,25)] },
            { apply: 'desaturate', params: [getRandomInt(0,25)] },
            { apply: 'red', params: [getRandomInt(0,25)] },
            { apply: 'green', params: [getRandomInt(0,25)] },
            { apply: 'blue', params: [getRandomInt(0,25)] },
        ]
        console.log('focusProps: ');
        console.log(focusProps);

        const summonEffectProps = {
            glowLowerRange: getRandomInt(0, 90),
            glowUpperRange: getRandomInt(280, 360),
            doGlow:getRandomInt(0,2),

            fadeLowerRange: getRandomArbitrary(0.7, 0.8),
            fadeUpperRange: getRandomArbitrary(0.85, 1),
            doFade:getRandomInt(0, 2),
        }
        console.log('summonEffectProps:');
        console.log(summonEffectProps);

        const focusEffectProps = {
            glowLowerRange: getRandomInt(0, 90),
            glowUpperRange: getRandomInt(280, 360),
            doGlow:getRandomInt(0, 2),

            fadeLowerRange: getRandomArbitrary(0.7, 0.8),
            fadeUpperRange: getRandomArbitrary(0.85, 1),
            doFade:getRandomInt(0, 2),
        }
        console.log('focusEffectProps:');
        console.log(focusEffectProps);


        const rotateSummons = async (degree) => {

            const findValue = (min, max, currentFrame) => {
                const range = max-min;
                const step = range / (180);

                if(currentFrame <= 180)
                {
                    return min + (step * currentFrame);
                }

                return  max - (step * (currentFrame - 180));
            }

            const glow = async (img, degree, effectProps) => {
                if(effectProps.doGlow === 1) {
                    const hue = findValue(effectProps.glowLowerRange, effectProps.glowUpperRange, degree)
                    await img.color([{apply: 'hue', params: [hue]}]);
                    console.log('hue: ' + hue);
                }

                return img;
            }

            const fade = async (img, degree, effectProps) => {
                if(effectProps.doFade === 1) {
                    const opacity = findValue(effectProps.fadeLowerRange, effectProps.fadeUpperRange, degree)
                    await img.opacity(opacity);
                    console.log('opacity: ' + opacity);
                }

                return img;
            }

            let bg = new Jimp(3000,3000, 'black');
            let summons = await Jimp.read(summonsFile);
            let focus = await Jimp.read(focusFile);

            await summons.color(summonsProps);
            await summons.rotate(degree, false);

            await focus.color(focusProps);

            summons = await glow(summons, degree, summonEffectProps);
            summons = await fade(summons, degree, summonEffectProps);

            focus = await glow(focus, degree, focusEffectProps);
            focus = await fade(focus, degree, focusEffectProps);

            await bg.composite(summons, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await bg.composite(focus, 500, 500, {
                mode: Jimp.BLEND_SOURCE_OVER,
            });

            console.log("started " + degree.toString() + " quantize");
            GifUtil.quantizeDekker(bg, 255)
            console.log("completed " + degree.toString() + " quantize");

            let frame = new GifFrame(new BitmapImage(bg.bitmap));
            frames.push(frame);
        }

        const degreeInc = 2;
        for(let degree = 0; degree < 360; degree = degree + degreeInc){
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



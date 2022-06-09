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



        const rotateSummons = async (degree) => {

            const popGLow = async (summons, degree) => {

                const glowMovePercent = 0.3

                if(degree <= 180){
                    await summons.color([{ apply: 'brighten', params: [20 + (degree * glowMovePercent)]}]);
                } else {
                    await summons.color([{ apply: 'brighten', params: [20 + (180 * glowMovePercent) - ((degree - 180) * glowMovePercent)]}]);
                }
            }

            let bg = await Jimp.read(bgFile);
            let summons = await Jimp.read(summonsFile);

            await summons.color(summonsProps);
            await summons.rotate(degree, false);

            await popGLow(summons, degree);

            await bg.composite(summons, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await bg.composite(focus, 0, 0, {
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



const fs = require('fs');
const gm = require('gm');
const path = require('path');
const Jimp = require('jimp');



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
        let summons = await Jimp.read(summonsFile);
        let bg = await Jimp.read(bgFile);

        focus.color([
            { apply: 'saturate', params: [getRandomInt(0,100)] },
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'lighten', params: [getRandomInt(-20,20)] },
            { apply: 'red', params: [getRandomInt(0,100)] },
            { apply: 'green', params: [getRandomInt(0,100)] },
            { apply: 'blue', params: [getRandomInt(0,100)] },
        ]);

        summons.color([
            { apply: 'saturate', params: [getRandomInt(0,100)] },
            { apply: 'hue', params: [getRandomInt(-360,360)] },
            { apply: 'lighten', params: [getRandomInt(-20,20)] },
            { apply: 'red', params: [getRandomInt(0,100)] },
            { apply: 'green', params: [getRandomInt(0,100)] },
            { apply: 'blue', params: [getRandomInt(0,100)] },
        ]);

        await summons.composite(focus, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        })

        await bg.composite(summons, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.5
        })

        await bg.writeAsync(outputFile);
    }

    const summonsList = getFilesInDirectory('/img/png/summons/png')
    const focusList = getFilesInDirectory('/img/png/focus/png')

    const summonsName = summonsList[getRandomInt(0, summonsList.length - 1)];
    const focusName = focusList[getRandomInt(0, focusList.length - 1)];

    const summons = path.join(__dirname, '/img/png/summons/png/' + summonsName)
    const focus = path.join(__dirname, '/img/png/focus/png/' + focusName)
    const bg = path.join(__dirname, '/img/png/backgrounds/Untitled-1.png')
    const fileOut = path.join(__dirname, '/img/output/' + Date.now().toString() + '.png')

    await imageOverlay(focus, summons, bg, fileOut)

    console.log('DONE' + index)

    if (index <= 100) {
        index = index + 1;
        main(index);
    }
}

let index = 1
main(index);



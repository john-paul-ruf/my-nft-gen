const fs = require('fs');
const gm = require('gm');
const path = require('path');

const main = (index) => {
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

    const recolorImage = (file, outfile) => {
        gm(file).negative().modulate(getRandomInt(50, 100), getRandomInt(40, 100), getRandomInt(0, 200)).write(outfile, function (err) {
            if (err) console.log(err);
        });
    }


    const summonsList = getFilesInDirectory('/img/png/summons/png')
    const focusList = getFilesInDirectory('/img/png/focus/png')

    const summonsName = summonsList[getRandomInt(0, summonsList.length - 1)];
    const focusName = focusList[getRandomInt(0, focusList.length - 1)];

    const summons = path.join(__dirname, '/img/png/summons/png/' +summonsName)
    const focus = path.join(__dirname, '/img/png/focus/png/' +focusName)

    const summonsOut = path.join(__dirname, '/img/png/summons/miff/' + summonsName)
    const focusOut = path.join(__dirname, '/img/png/focus/miff/' + focusName)

    recolorImage(summons, summonsOut)
    recolorImage(focus, focusOut)

    setTimeout(() => {
        gm()
            .command('convert')
            .in('xc:transparent')
            .in('-compose')
            .in('Over')
            .in(path.join(__dirname, '/img/png/backgrounds/Untitled-1.png'))
            .in(summonsOut)
            .in(focusOut)
            .in('-mosaic')
            .write(path.join(__dirname, '/img/output/' + Date.now().toString() + '.png'), function (err) {
                if (err) console.log(err);
            });

        console.log('DONE' + index)

        if(index <= 1000)
        {
            index = index + 1;
            main(index);
        }

    }, 30000)


}

let index = 1
main(index);



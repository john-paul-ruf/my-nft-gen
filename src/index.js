const fs = require('fs');
const gm = require('gm');
const path = require('path');

const main = () => {
    const getFilesInDirectory = (dir) => {

        const directoryPath = path.join(__dirname, dir);
        const list = [];

        //passsing directoryPath and callback function
        fs.readdirSync(directoryPath).forEach(file => {
            console.log(file);
            list.push(file);
        });

        return list;
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    const summonsList = getFilesInDirectory('/img/png/summons/png')
    const focusList = getFilesInDirectory('/img/png/focus/png')

/*    gm(2000, 2000, "#000000")
        .composite(path.join(__dirname, '/img/png/summons/png/' + summonsList[getRandomInt(0, focusList.length - 1)]))
        .composite(path.join(__dirname, 'img/png/backgrounds/Untitled-1.png'))
        .write(path.join(__dirname, '/img/tmp/stage-1.png'), function (err) {
            if (err) console.log(err);
            console.log("Done!")
        });

    gm(2000, 2000, "#000000")
        .composite(path.join(__dirname, '/img/png/focus/png/' + focusList[getRandomInt(0, focusList.length - 1)]))
        .composite(path.join(__dirname, '/img/tmp/stage-1.png'))
        .write(path.join(__dirname, '/img/output/' + Date.now().toString() + '.png'), function (err) {
            if (err) console.log(err);
            console.log("Done!")
        });*/


/*    gm(path.join(__dirname, '/img/png/backgrounds/Untitled-1.png'))
        .command("composite")
        .in(path.join(__dirname, '/img/png/focus/png/' + focusList[getRandomInt(0, focusList.length - 1)]))
        .in(path.join(__dirname, '/img/png/summons/png/' + summonsList[getRandomInt(0, summonsList.length - 1)]))
        .write(path.join(__dirname, '/img/output/' + Date.now().toString() + '.png'), function (err) {
            if (!err)
                console.log(' hooray! ');
            else
                console.log(err);
        });*/

/*
    gm(2000,2000)
        .in(path.join(__dirname, '/img/png/backgrounds/Untitled-1.png'))
        .in(path.join(__dirname, '/img/png/summons/png/' + summonsList[getRandomInt(0, summonsList.length - 1)]))
        .in(path.join(__dirname, '/img/png/focus/png/' + focusList[getRandomInt(0, focusList.length - 1)]))
        .compose()
        .write(path.join(__dirname, '/img/output/' + Date.now().toString() + '.png'), function (err) {
            if (err) console.log(err);
        });
*/

    const cmd = 'gm convert xc:transparent -compose Over '+
    path.join(__dirname, '/img/png/backgrounds/Untitled-1.png')
    + ' ' + path.join(__dirname, '/img/png/summons/png/' + summonsList[getRandomInt(0, summonsList.length - 1)])
    + ' '+ path.join(__dirname, '/img/png/focus/png/' + focusList[getRandomInt(0, focusList.length - 1)])
    + ' -mosaic ' + path.join(__dirname, '/img/output/' + Date.now().toString() + '.png')

    console.log(cmd);

    gm()
        .command('convert')
        .in('xc:transparent')
        .in('-compose')
        .in('Over')
        .in(path.join(__dirname, '/img/png/backgrounds/Untitled-1.png'))
        .in(path.join(__dirname, '/img/png/summons/png/' + summonsList[getRandomInt(0, summonsList.length - 1)]))
        .in(path.join(__dirname, '/img/png/focus/png/' + focusList[getRandomInt(0, focusList.length - 1)]))
        .in('-mosaic')
        .write(path.join(__dirname, '/img/output/' + Date.now().toString() + '.png'), function (err) {
        if (err) console.log(err);
    });
}

main();
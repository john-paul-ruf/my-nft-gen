import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {getRandomInt} from "./random.js";

export class Config {
    constructor() {

        const getFilesInDirectory = (dir) => {

            const directoryPath = path.join(directory, dir);
            const list = [];

            fs.readdirSync(directoryPath).forEach(file => {
                if (!file.startsWith('.')) {
                    list.push(file);
                }
            });

            return list;
        }

        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/logic', '');

        const summonsList = getFilesInDirectory('/img/png/summons/png')
        const focusList = getFilesInDirectory('/img/png/focus/png')
        const glossList = getFilesInDirectory('/img/png/gloss/png')
        const sigList = getFilesInDirectory('/img/png/sig/png')

        this._INVOKER_ = 'John Ruf - Bookstore Illuminati';
        this.runName = 'dialing-in'

        this.summonsName = summonsList[getRandomInt(0, summonsList.length)];
        this.focusName = focusList[getRandomInt(0, focusList.length)];
        this.glossName = glossList[getRandomInt(0, glossList.length)];
        this.sigName = sigList[getRandomInt(0, sigList.length)];

        this.finalImageSize = 1000;
        this.colorDepth = 256;
        this.frameInc = 1;
        this.numberOfFrame = 120;

        this.summonsFile = path.join(directory, '/img/png/summons/png/' + this.summonsName);
        this.focusFile = path.join(directory, '/img/png/focus/png/' + this.focusName);

        this.glossFile = path.join(directory, '/img/png/gloss/png/' + this.glossName);
        this.sigFile = path.join(directory, '/img/png/sig/png/' + this.sigName);

        this.finalFileName = +Date.now().toString() + '.gif'
        this.fileOut = path.join(directory, '/img/output/' + this.finalFileName);
    }
}


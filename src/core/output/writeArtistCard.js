import { promises as fs } from 'fs';
import { timeToString } from '../utils/timeToString.js';

export const writeArtistCard = async (config, composeInfo) => {
    config.endTime = new Date();
    const rez = config.endTime.getTime() - config.startTime.getTime();
    config.processingTime = timeToString(rez);

    console.log(await composeInfo.composeInfo());

    fs.writeFile(`${config.fileOut}.txt`, await composeInfo.composeInfo(), 'utf-8');
};

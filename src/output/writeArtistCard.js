import fs from "fs";
import {composeInfo} from "../logic/composeInfo.js";
import {timeToString} from "../logic/timeToString.js";

export const writeArtistCard = (config, effects, finalImageEffects) => {

    config.endTime = new Date();
    const rez = config.endTime.getTime() - config.startTime.getTime();
    config.processingTime = timeToString(rez);

    console.log("gif write start");
    console.log(composeInfo(config, effects));

    fs.writeFileSync(config.fileOut + '.txt', composeInfo(config, effects, finalImageEffects), 'utf-8');


}
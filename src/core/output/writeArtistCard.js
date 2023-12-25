import fs from "fs";
import {composeInfo} from "../utils/composeInfo.js";
import {timeToString} from "../utils/timeToString.js";

export const writeArtistCard = (config, effects, finalImageEffects,settings) => {

    config.endTime = new Date();
    const rez = config.endTime.getTime() - config.startTime.getTime();
    config.processingTime = timeToString(rez);

    console.log("gif write start");
    console.log(composeInfo(config, effects, finalImageEffects, settings));

    fs.writeFileSync(config.fileOut + '.txt', composeInfo(config, effects, finalImageEffects), 'utf-8');


}
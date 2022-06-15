import {findValue} from "../logic/findValue.js";
import Jimp from "jimp";
import {getImagePaths} from "../logic/getImagePaths.js";

export const radiate = async (img, times, currentFrame, totalFrame) => {
    const alpha = findValue(2, 13, times, totalFrame, currentFrame);

    let hex = '#00FF00';
    hex = hex + alpha.toString(16) + + alpha.toString(16);

    const paths = await getImagePaths(img);

    paths.forEach(path => {
        path.forEach(pos => {
            let color = Jimp.cssColorToHex(hex)
            img.setPixelColor(color, pos.x, pos.y)
        })
    })
}
import Jimp from "jimp";

export const getImagePaths = async (sourceImg) => {

    const paths = [];

    const getPixel = async (x, y) => {
        const hex = sourceImg.getPixelColor(x, y);

        if(hex==0){
            return '00';
        }

        return hex.toString(16).slice(-2)
    }

    const isEdge = async (x, y) => {

        if (x > sourceImg.bitmap.width || y > sourceImg.bitmap.height) {
            return false;
        }

        const pixel = await getPixel(x, y);
        const pixelNext = await getPixel(x + 1, y);

        if (pixel == '00' && pixelNext != '00' || pixel != '00' && pixelNext == '00') {
            return true;
        }

        return false;
    }

    const findPath = async (x, y) => {
        const path = [];

        let tarY = y;
        let tarX = x;

        let nextY = y;
        let nextX = x;

        while (path.length == 0 || !path.some(point => point.x == tarX && point.y == tarY)) {

            if (await isEdge(tarX, tarY + 1)) { //up
                nextY = tarY + 1;
                nextX = tarX;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX + 1, tarY + 1)) { //up forward
                nextY = tarY + 1;
                nextX = tarX + 1;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX + 1, tarY)) { //forward
                nextY = tarY;
                nextX = tarX + 1;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX + 1, tarY - 1)) { //down forward
                nextY = tarY - 1;
                nextX = tarX + 1;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX, tarY - 1)) { //down
                nextY = tarY - 1;
                nextX = tarX;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX - 1, tarY - 1)) {// down back
                nextY = tarY - 1;
                nextX = tarX - 1;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX - 1, tarY)) {// back
                nextY = tarY;
                nextX = tarX - 1;
                path.push({x:nextX,y:nextY});
            } else if (await isEdge(tarX - 1, tarY + 1)) {//up back
                nextY = tarY + 1;
                nextX = tarX - 1;
                path.push({x:nextX,y:nextY});
            }

            if(tarX == nextX && tarY == nextY){
                path.push({x:nextX,y:nextY});
                break;
            }

            tarX = nextX;
            tarY = nextY;
        }

        paths.push(path);
    }


    for (let x = 0; x < sourceImg.bitmap.width; x++) {
        for (let y = 0; y < sourceImg.bitmap.height; y++) {
            if (await isEdge(x, y)) {
                if (paths.length == 0 || !paths.some(obj => !obj.some(pos => pos.x == x && pos.y == y))) {
                    await findPath(x, y)
                }
            }
        }
    }

    return paths;
}

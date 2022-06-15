import Jimp from "jimp";

export const getImagePaths = async (sourceImg) => {

    const paths = [];

    const getPixel = async (x, y) => {
        const hex = sourceImg.getPixelColor(x, y);
        return Jimp.intToRGBA(hex);
    }

    const isTransparent = (hex) => {
        return hex.r == 0 && hex.g == 0 && hex.b == 0 && hex.a == 0;
    }

    const isEdge = async (x, y) => {

        if (x < 0 || y < 0 || x > sourceImg.bitmap.width || y > sourceImg.bitmap.height) {
            return false;
        }

        const pixel = await getPixel(x, y);
        const pixelNext = await getPixel(x + 1, y);

        if (isTransparent(pixel) && !isTransparent(pixelNext) || !isTransparent(pixel) && isTransparent(pixelNext)) {
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

        while (path.length == 0 || !pointInPath(path, tarX, tarY)) {

            tarX = nextX;
            tarY = nextY;

            if (await isEdge(tarX, tarY + 1) && !pointInPath(path, tarX, tarY)) { //up
                nextY = tarY + 1;
                nextX = tarX;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX + 1, tarY + 1) && !pointInPath(path, tarX, tarY)) { //up forward
                nextY = tarY + 1;
                nextX = tarX + 1;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX + 1, tarY) && !pointInPath(path, tarX, tarY)) { //forward
                nextY = tarY;
                nextX = tarX + 1;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX + 1, tarY - 1) && !pointInPath(path, tarX, tarY)) { //down forward
                nextY = tarY - 1;
                nextX = tarX + 1;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX, tarY - 1) && !pointInPath(path, tarX, tarY)) { //down
                nextY = tarY - 1;
                nextX = tarX;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX - 1, tarY - 1) && !pointInPath(path, tarX, tarY)) {// down back
                nextY = tarY - 1;
                nextX = tarX - 1;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX - 1, tarY) && !pointInPath(path, tarX, tarY)) {// back
                nextY = tarY;
                nextX = tarX - 1;
                path.push({x: nextX, y: nextY});
            } else if (await isEdge(tarX - 1, tarY + 1) && !pointInPath(path, tarX, tarY)) {//up back
                nextY = tarY + 1;
                nextX = tarX - 1;
                path.push({x: nextX, y: nextY});
            }

            if (tarX == nextX && tarY == nextY) {
                path.push({x: nextX, y: nextY});
                break;
            }
        }

        paths.push(path);
    }

    const pointInPaths = (x, y) => {

        let inPath = false;

        paths.forEach(path => {
            if (pointInPath(path, x, y)) {
                inPath = true;
            }
        })

        return inPath;
    }

    const pointInPath = (path, x, y) => {
        let inPath = false;
        path.forEach(pos => {
            if (pos.x == x && pos.y == y) {
                inPath = true;
            }
        })
        return inPath;
    }

    for (let y = 0; y < sourceImg.bitmap.height; y++) {
        for (let x = 0; x < sourceImg.bitmap.width; x++) {
            if (await isEdge(x, y)) {
                if (paths.length == 0 || !pointInPaths(x, y)) {
                    await findPath(x, y)
                }
            }
        }
    }

    return paths;
}

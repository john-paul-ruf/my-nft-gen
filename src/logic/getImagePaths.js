import Jimp from "jimp";

export const getImagePaths = async (sourceImg) => {

    const paths = [];

    const getPixel = (x, y) => {
        const hex = sourceImg.getPixelColor(x, y);
        return Jimp.intToRGBA(hex);
    }

    const isTransparent = (hex) => {
        return hex.a == 0;
    }

    const isEdge = (x, y) => {

        const checkAround = (pixel, x, y) => {
            const pixelNext = getPixel(x, y);

            return isTransparent(pixel) && !isTransparent(pixelNext) || !isTransparent(pixel) && isTransparent(pixelNext);


        }

        if (x < 0 || y < 0 || x > sourceImg.bitmap.width || y > sourceImg.bitmap.height) {
            return false;
        }

        const pixel = getPixel(x, y);

        return checkAround(pixel, x, y + 1)
            || checkAround(pixel, x + 1, y + 1)
            || checkAround(pixel, x + 1, y)
            || checkAround(pixel, x + 1, y - 1)
            || checkAround(pixel, x, y - 1)
            || checkAround(pixel, x - 1, y - 1)
            || checkAround(pixel, x - 1, y)
            || checkAround(pixel, x - 1, y + 1)

    }

    const findPath = async (x, y) => {
        const path = [];

        const isNext = (x, y) => {
            return isEdge(x, y) && !pointInPaths(x, y) && !pointInPath(path, x, y);
        }

        const processPixel = async (x, y) => {
            if (isNext(x, y)) {
                path.push({x: x, y: y});
                await search(x, y);
            }
        }

        const search = async (x, y) => {
            await processPixel(x, y + 1)
            await processPixel(x + 1, y + 1)
            await processPixel(x + 1, y)
            await processPixel(x + 1, y - 1)
            await processPixel(x, y - 1)
            await processPixel(x - 1, y - 1)
            await processPixel(x - 1, y)
            await processPixel(x - 1, y + 1)
        }

        path.push({x: x, y: y});

        await search(x, y);

        if (path.length > 2) {
            paths.push(path);
        }
    }

    const pointInPaths = (x, y) => {
        for (let i = 0; i < paths.length; i++) {
            if (pointInPath(paths[i], x, y)) {
                return true;
            }
        }
        return false;
    }

    const pointInPath = (path, x, y) => {
        for (let i = 0; i < path.length; i++) {
            if (path[i].x == x && path[i].y == y) {
                return true;
            }
        }
        return false;
    }

    for (let y = 0; y < sourceImg.bitmap.height; y++) {
        for (let x = 0; x < sourceImg.bitmap.width; x++) {
            if (isEdge(x, y)) {
                if (paths.length == 0 || !pointInPaths(x, y)) {
                    await findPath(x, y)
                }
            }
        }
    }

    return paths;
}
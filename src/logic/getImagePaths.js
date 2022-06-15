import Jimp from "jimp";

export const getImagePaths = (sourceImg) => {

    const paths = [];

    const getPixel = (x, y) => {
        const hex = sourceImg.getPixelColor(x, y);
        return Jimp.intToRGBA(hex);
    }

    const isTransparent = (hex) => {
        return hex.a == 0;
    }

    const isEdge = (x, y) => {

        if (x < 0 || y < 0 || x > sourceImg.bitmap.width || y > sourceImg.bitmap.height) {
            return false;
        }

        const pixel = getPixel(x, y);
        const pixelNext = getPixel(x + 1, y);

        if (isTransparent(pixel) && !isTransparent(pixelNext) || !isTransparent(pixel) && isTransparent(pixelNext)) {
            return true;
        }

        return false;
    }

    const findPath = (x, y) => {
        const path = [];

        const isNext = (x, y) => {
            return isEdge(x, y) && !pointInPaths(x, y) && !pointInPath(path, x, y);
        }

        const processPixel = (x, y) => {
            if (isNext(x, y)) {
                path.push({x: x, y: y});
                search(x, y);
            }
        }

        const search = (x, y) => {
            processPixel(x, y + 1)
            processPixel(x + 1, y + 1)
            processPixel(x + 1, y)
            processPixel(x + 1, y - 1)
            processPixel(x, y - 1)
            processPixel(x - 1, y - 1)
            processPixel(x - 1, y)
            processPixel(x - 1, y + 1)
        }

        path.push({x: x, y: y});

        search(x, y);

        if (path.length > 2) {
            paths.push(path);
        }
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
            if (isEdge(x, y)) {
                if (paths.length == 0 || !pointInPaths(x, y)) {
                    findPath(x, y)
                }
            }
        }
    }

    return paths;
}

import Jimp from "jimp";

/**

 Given an image with transparency, find the path(s), as an array, of where the pixels become non-transparent.

 It remains to be seen if the path is an ordered path.
 Meaning the array represent a list of contiguous points.

 **/

export const getImagePaths = async (sourceImg) => {

        const paths = [];

        const getPixel = (x, y) => {
            const hex = sourceImg.getPixelColor(x, y);
            return Jimp.intToRGBA(hex);
        }

        const isTransparent = (hex) => {
            return hex.a === 0;
        }


        //is any point one pixel away non-transparent
        const isEdge = (x, y, path) => {

            const checkAround = (pixel, x, y) => {
                if (!pointInPaths(x, y) && path && !pointInPath(path, x, y)) { //Make sure we don't already have it
                    const pixelNext = getPixel(x, y);
                    return isTransparent(pixel) && !isTransparent(pixelNext) || !isTransparent(pixel) && isTransparent(pixelNext);
                }
            }

            if (x < 0 || y < 0 || x > sourceImg.bitmap.width || y > sourceImg.bitmap.height) {
                return false;
            }

            const pixel = getPixel(x, y);

            return checkAround(pixel, x, y + 1, path)
                || checkAround(pixel, x + 1, y + 1, path)
                || checkAround(pixel, x + 1, y, path)
                || checkAround(pixel, x + 1, y - 1, path)
                || checkAround(pixel, x, y - 1, path)
                || checkAround(pixel, x - 1, y - 1, path)
                || checkAround(pixel, x - 1, y, path)
                || checkAround(pixel, x - 1, y + 1, path)
        }


        //Important - Path finding starts here
        const findPath = async (x, y) => {
            const path = [];

            const isNext = (x, y) => {
                return !pointInPaths(x, y) && !pointInPath(path, x, y) && isEdge(x, y); //make sure we don't already have it before checking
            }

            const processPixel = async (x, y) => {
                if (isNext(x, y)) { //is pixel at point an edge
                    path.push({x: x, y: y});
                    await search(x, y); //find next point in path
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

            //start if in findPath here
            //store current point
            path.push({x: x, y: y});

            //look for the next
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
            return path.findIndex(pos => pos.x === x && pos.y === y) >= 0;
        }

        //start here: outermost layer
        for (let y = 0; y < sourceImg.bitmap.height; y++) {
            for (let x = 0; x < sourceImg.bitmap.width; x++) {
                if (isEdge(x, y)) { //we found a non-transparent pixel
                    if (paths.length === 0 || !pointInPaths(x, y)) { //we don't already have this point in a path
                        await findPath(x, y) //search for complete path if possible
                    }
                }
            }
        }

        return paths;
    }

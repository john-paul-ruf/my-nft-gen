import {getRandomIntExclusive, getRandomIntInclusive, randomNumber} from "../../../core/math/random.js";
import {lensFlareEffect} from "./effect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";





export const generate = async (settings) => {

    const finalImageSize = GlobalSettings.getFinalImageSize();

    const config = {

        layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
        layerOpacityTimes: {lower: 2, upper: 6},

        elementOpacityRange: {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.8, upper: 1}},
        elementOpacityTimes: {lower: 2, upper: 6},

        elementGastonRange: {bottom: {lower: 5, upper: 10}, top: {lower: 15, upper: 30}},
        elementGastonTimes: {lower: 2, upper: 6},

        numberOfFlareHex: {lower: 0, upper: 0},
        flareHexSizeRange: {lower: finalImageSize.shortestSide * 0.015, upper: finalImageSize.shortestSide * 0.025},

        angleRangeFlareHex: {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
        angleGastonTimes: {lower: 1, upper: 6},

        numberOfFlareRings: {lower: 50, upper: 100},
        flareRingsSizeRange: {lower: finalImageSize.shortestSide * 0.1, upper: finalImageSize.longestSide * 0.55},
        flareRingStroke: {lower: 1, upper: 1},

        numberOfFlareRays: {lower: 50, upper: 100},
        flareRaysSizeRange: {lower: finalImageSize.longestSide * 0.4, upper: finalImageSize.longestSide * 0.55},
        flareRaysStroke: {lower: 1, upper: 1},

        //no blur, it is bad
        //trying blur again - sharp: ok, jimp: not the best
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 3}},
        blurTimes: {lower: 2, upper: 4},

        strategy: [/*'original',*/ 'color-bucket' /*, 'neutral-bucket'*/],

        flareColors: [
            '#d5fecc',
            '#acff99',
            '#83ff66',
            '#5aff33',
            '#31ff00',
            '#9db0ff',
            '#ec9dff',
            '#ffec9d',
            '#ffbb9d',
            '#ff9daf',
        ],

        getFlareColor: async (strategy) => {
            switch (strategy) {
                case 'original':
                    return config.flareColors[getRandomIntExclusive(0, config.flareColors.length)];
                case 'color-bucket':
                    return await settings.getColorFromBucket();
                case 'neutral-bucket':
                    return await settings.getNeutralFromBucket();
                default:
                    return config.flareColors[getRandomIntExclusive(0, config.flareColors.length)];
            }
        }
    }

    const data =
        {
            height: finalImageSize.height,
            width: finalImageSize.width,
            center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},

            numberOfFlareHex: getRandomIntInclusive(config.numberOfFlareHex.lower, config.numberOfFlareHex.upper),
            numberOfFlareRings: getRandomIntInclusive(config.numberOfFlareRings.lower, config.numberOfFlareRings.upper),
            numberOfFlareRays: getRandomIntInclusive(config.numberOfFlareRays.lower, config.numberOfFlareRays.upper),

            layerOpacityRange: {
                lower: randomNumber(config.layerOpacityRange.bottom.lower, config.layerOpacityRange.bottom.upper),
                upper: randomNumber(config.layerOpacityRange.top.lower, config.layerOpacityRange.top.upper)
            },
            layerOpacityTimes: getRandomIntInclusive(config.layerOpacityTimes.lower, config.layerOpacityTimes.upper),

            blurRange: {
                lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
            },
            blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),

            angleRangeFlareHex: {
                lower: randomNumber(config.angleRangeFlareHex.bottom.lower, config.angleRangeFlareHex.bottom.upper),
                upper: randomNumber(config.angleRangeFlareHex.top.lower, config.angleRangeFlareHex.top.upper)
            },
            angleGastonTimes: getRandomIntInclusive(config.angleGastonTimes.lower, config.angleGastonTimes.upper),

            strategy: config.strategy[getRandomIntExclusive(0, config.strategy.length)],

            getInfo: () => {
                return `${lensFlareEffect.name}: ${data.strategy} strategy, ${data.numberOfFlareHex} polygons, ${data.numberOfFlareRings} rings, ${data.numberOfFlareRays} rays`
            }
        };


    const getFlareHexArray = async (num, strategy) => {
        const info = [];

        for (let i = 0; i < num; i++) {
            info.push({
                size: getRandomIntInclusive(config.flareHexSizeRange.lower, config.flareHexSizeRange.upper),
                color: await config.getFlareColor(strategy),
                strokeColor: await config.getFlareColor(strategy),
                sides: getRandomIntInclusive(6, 6), //ended up with hex...
                angle: getRandomIntInclusive(0, 360),
                offset: getRandomIntInclusive(-finalImageSize.width * 0.15, finalImageSize.width * 0.15),
                opacity: {
                    lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                    upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
                },
                opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
            });
        }

        return info;
    }

    const getFlareRingArray = async (num, strategy) => {
        const info = [];

        for (let i = 0; i <= num; i++) {
            info.push({
                size: getRandomIntInclusive(config.flareRingsSizeRange.lower, config.flareRingsSizeRange.upper),
                stroke: getRandomIntInclusive(config.flareRingStroke.lower, config.flareRingStroke.upper),
                color: await config.getFlareColor(strategy),
                opacity: {
                    lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                    upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
                },
                opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
                gastonRange: {
                    lower: randomNumber(config.elementGastonRange.bottom.lower, config.elementGastonRange.bottom.upper),
                    upper: randomNumber(config.elementGastonRange.top.lower, config.elementGastonRange.top.upper)
                },
                gastonTimes: getRandomIntInclusive(config.elementGastonTimes.lower, config.elementGastonTimes.upper),
                gastonInvert: getRandomIntInclusive(0, 1) > 0,

                blurRange: {
                    lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                    upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
                },
                blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
            });
        }

        return info;
    }

    const getFlareRayArray = async (num, strategy) => {
        const info = [];

        for (let i = 0; i <= num; i++) {
            info.push({
                size: getRandomIntInclusive(config.flareRaysSizeRange.lower, config.flareRaysSizeRange.upper),
                stroke: getRandomIntInclusive(config.flareRaysStroke.lower, config.flareRaysStroke.upper),
                angle: getRandomIntInclusive(0, 360),
                color: await config.getFlareColor(strategy),
                opacity: {
                    lower: randomNumber(config.elementOpacityRange.bottom.lower, config.elementOpacityRange.bottom.upper),
                    upper: randomNumber(config.elementOpacityRange.top.lower, config.elementOpacityRange.top.upper)
                },
                opacityTimes: getRandomIntInclusive(config.elementOpacityTimes.lower, config.elementOpacityTimes.upper),
                offset: getRandomIntInclusive(finalImageSize.width * 0.15, finalImageSize.width * 0.25,),
                gastonRange: {
                    lower: randomNumber(config.elementGastonRange.bottom.lower, config.elementGastonRange.bottom.upper),
                    upper: randomNumber(config.elementGastonRange.top.lower, config.elementGastonRange.top.upper)
                },
                gastonTimes: getRandomIntInclusive(config.elementGastonTimes.lower, config.elementGastonTimes.upper),
                gastonInvert: getRandomIntInclusive(0, 1) > 0,

                blurRange: {
                    lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
                    upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
                },
                blurTimes: getRandomIntInclusive(config.blurTimes.lower, config.blurTimes.upper),
            });
        }

        return info;
    }

    data.hexArray = await getFlareHexArray(data.numberOfFlareHex, data.strategy);
    data.ringArray = await getFlareRingArray(data.numberOfFlareRings, data.strategy);
    data.rayArray = await getFlareRayArray(data.numberOfFlareRays, data.strategy);

    return data;
}
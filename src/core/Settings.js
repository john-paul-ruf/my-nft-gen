//Encapsulated globals are less bad...
import {getRandomFromArray, getRandomIntExclusive, getRandomIntInclusive} from "./math/random.js";
import parseArgs from 'minimist';
import {NeonColorScheme, NeonColorSchemeFactory} from "./color/NeonColorSchemeFactory.js";

export class Settings {
    constructor() {

        const availableColorSchemes = [NeonColorScheme.neons, /* NeonColorScheme.blueNeons, NeonColorScheme.redNeons, NeonColorScheme.greenNeons */];

        this.colorScheme = NeonColorSchemeFactory.getColorScheme(getRandomFromArray(availableColorSchemes));

        //For 2D palettes
        this.neutrals = [
            '#FFFFFF'
            /*   '#FFFF00',
               '#FF00FF',
               '#00FFFF',
               '#FF0000',
               '#00FF00',
               '#0000FF',*/
        ];

        //For 2D palettes
        this.backgrounds = ['#000000',];

        //for three-dimensional lighting
        this.lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF',]
    }

    async getColorFromBucket() {
        return this.colorScheme.getColorFromBucket();
    };

   async getNeutralFromBucket()  {
        return this.neutrals[getRandomIntExclusive(0, this.neutrals.length)]
    };

   async getBackgroundFromBucket()  {
        return this.backgrounds[getRandomIntExclusive(0, this.backgrounds.length)]
    };

   async getLightFromBucket()  {
        return this.lights[getRandomIntExclusive(0, this.lights.length)]
    };

   async getColorSchemeInfo()  {
        return this.colorScheme.getColorSchemeInfo();
    };
}


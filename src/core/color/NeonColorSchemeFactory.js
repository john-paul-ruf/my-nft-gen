import {ColorScheme} from "./ColorScheme.js";

export const NeonColorScheme = {
    neons: 'neons',
    redNeons: 'red-neons',
    blueNeons: 'blue-neons',
    greenNeons: 'green-neons',
}

export class NeonColorSchemeFactory {
    constructor() {
    }

    static getColorScheme = (neonColorScheme) => {
        switch (neonColorScheme) {
            case NeonColorScheme.neons:
                return new ColorScheme({
                    colorBucket:
                        [
                            '#FFFF00',
                            '#FF00FF',
                            '#00FFFF',
                            '#FF0000',
                            '#00FF00',
                            '#0000FF',
                        ],
                    colorSchemeInfo: `**Color Strategy**: ${NeonColorScheme.neons}\n`,
                });
            case NeonColorScheme.redNeons:
                return new ColorScheme({
                    colorBucket:
                        [
                            '#FFFF00',
                            '#FF00FF',
                            '#FF0000',
                        ],
                    colorSchemeInfo: `**Color Strategy**: ${NeonColorScheme.redNeons}\n`,
                });
            case NeonColorScheme.blueNeons:
                return new ColorScheme({
                    colorBucket:
                        [
                            '#FF00FF',
                            '#00FFFF',
                            '#0000FF',
                        ],
                    colorSchemeInfo: `**Color Strategy**: ${NeonColorScheme.blueNeons}\n`,
                });
            case NeonColorScheme.greenNeons:
                return new ColorScheme({
                    colorBucket:
                        [
                            '#FFFF00',
                            '#00FFFF',
                            '#00FF00',
                        ],
                    colorSchemeInfo: `**Color Strategy**: ${NeonColorScheme.greenNeons}\n`,
                });

            default:
                throw 'Not a color scheme';
        }
    }

}
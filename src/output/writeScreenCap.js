import fs from "fs";

export const writeScreenCap = async (filename, config) => {
    await fs.copyFile(filename, config.fileOut + '.png', () => {
        
    });
}
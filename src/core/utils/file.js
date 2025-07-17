import fs from "fs";

export const checkFileExists = async (filepath) => new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
        resolve(!error);
    });
});
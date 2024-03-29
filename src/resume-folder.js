import inquirer from 'inquirer';
import fs from 'fs';
import { Settings } from './core/Settings.js';
import { LoopBuilder } from './core/animation/LoopBuilder.js';

// src/red-eye/red-eye-zefx84u/red-eye-zefx84u-settings.json
// src/red-eye/red-eye-0uz6f75/red-eye-0uz6f75-settings.json
const mainMenu = () => {
    const InitialActions = {
        Resume: 'Resume a build',
        Exit: 'Exit',
    };

    inquirer.prompt([
        {
            type: 'list',
            name: 'initialAction',
            message: 'Options',
            choices: [
                InitialActions.Resume,
                InitialActions.Exit,
            ],
        },
    ])
        .then((answers) => {
            switch (answers.initialAction) {
            case InitialActions.Exit:
                return;
            case InitialActions.Resume:
                inquirer.prompt([
                    {
                        name: 'filename',
                        message: 'Input settings file name',
                    },
                ])
                    .then((answers) => {
                        async function CreateLoop() {
                            const settings = Settings.from(JSON.parse(fs.readFileSync(answers.filename)));
                            const loopBuilder = new LoopBuilder(settings);
                            return loopBuilder.constructLoop();
                        }

                        const promiseArray = [];
                        promiseArray.push(CreateLoop());
                        Promise.all(promiseArray).then(() => {
                            mainMenu();
                        });
                    });
                break;
            }
        });
};

mainMenu();

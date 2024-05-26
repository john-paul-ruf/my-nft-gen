import inquirer from 'inquirer';
import fs from 'fs';
import { Settings } from './core/Settings.js';
import { LoopBuilder } from './core/animation/LoopBuilder.js';

// src/fuzz-flare/fuzz-flare-0lbk5jn/fuzz-flare-0lbk5jn-settings.json

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

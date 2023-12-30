import inquirer from 'inquirer';
import {Settings} from "./core/Settings.js";
import {SettingsFactory} from "./core/SettingsFactory.js";
import {LoopBuilder} from "./core/animation/LoopBuilder.js";
import fs from "fs";

const mainMenu = () => {


    const workingDirectory = `src/img/working/`

    const InitialActions = {
        Gen: 'Generate Random Loop',
        Preview: 'Generate Screen Cap and Settings',
        Load: 'Load From File',
        EverythingBagelTest: 'Test All Effects At Once (not recommended)'
    }

    const HowMany = {
        One: 'one',
        Two: 'two',
        Three: 'three'
    }

    inquirer.prompt([
        {
            type: 'list',
            name: 'initialAction',
            message: 'Options',
            choices: [
                InitialActions.Gen,
                InitialActions.Preview,
                InitialActions.Load,
                InitialActions.EverythingBagelTest,

            ]
        },
    ])
        .then(answers => {

            switch (answers.initialAction) {
                case InitialActions.Gen:
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'howMany',
                            message: 'How Many?',
                            choices: [
                                HowMany.One,
                                HowMany.Two,
                                HowMany.Three
                            ]
                        },
                    ])
                        .then(answers => {

                            let batchAmount = 0;

                            switch (answers.howMany) {
                                case HowMany.One:
                                    batchAmount = 1;
                                    break;
                                case HowMany.Two:
                                    batchAmount = 2;
                                    break;
                                case HowMany.Three:
                                    batchAmount = 3;
                                    break;
                            }

                            async function CreateLoop() {
                                const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.bluePlateSpecial});
                                const loopBuilder = new LoopBuilder(settings);
                                return loopBuilder.constructLoop();
                            }

                            const promiseArray = []

                            for (let i = 0; i < batchAmount; i++) {
                                promiseArray.push(CreateLoop());
                            }

                            Promise.all(promiseArray).then(() => {
                                mainMenu();
                            });
                        })
                    break;
                case InitialActions.Load:
                    inquirer.prompt([
                        {
                            name: 'filename',
                            message: 'filename?',
                        },
                    ])
                        .then(answers => {

                            async function CreateLoop() {
                                const settings = Settings.from(JSON.parse(fs.readFileSync(workingDirectory + answers.filename)))
                                const loopBuilder = new LoopBuilder(settings);
                                return loopBuilder.constructLoop();
                            }

                            const promiseArray = []
                            promiseArray.push(CreateLoop());
                            Promise.all(promiseArray).then(() => {
                                mainMenu();
                            });
                        })
                    break;
                case InitialActions.EverythingBagelTest:

                async function CreateLoop() {
                    const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.everythingBagel});
                    const loopBuilder = new LoopBuilder(settings);
                    return loopBuilder.constructLoop();
                }

                    const promiseArray = []
                    promiseArray.push(CreateLoop());
                    Promise.all(promiseArray).then(() => {
                        mainMenu();
                    });
                    break;
                case InitialActions.Preview:

                async function CreatePreview() {
                    const settings = await SettingsFactory.getPresetSetting({request: SettingsFactory.AvailableSettings.bluePlateSpecial});
                    const loopBuilder = new LoopBuilder(settings);
                    return loopBuilder.constructPreview();
                }

                    CreatePreview().then((data) => {
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: `processLoop`,
                                message: `Create full loop for ${data.config.finalFileName}-settings.json`,
                                choices: [
                                    'Yes',
                                    'No'
                                ]
                            },
                        ])
                            .then(answers => {
                                switch (answers.processLoop) {
                                    case 'Yes':

                                    async function CreateLoop() {
                                        const settings = Settings.from(JSON.parse(fs.readFileSync(workingDirectory + data.config.finalFileName + '-settings.json')))
                                        const loopBuilder = new LoopBuilder(settings);
                                        return loopBuilder.constructLoop();
                                    }

                                        CreateLoop().then(() => mainMenu());
                                        break;
                                    case 'No':
                                        mainMenu();
                                        break;
                                }

                            })
                    });

                    break;
            }
        });
}

mainMenu();
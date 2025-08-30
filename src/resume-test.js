import {ResumeProject} from './app/ResumeProject.js';
import path from 'path';

// Use the ResumeProject function with the test settings file
const testSettingsPath = path.join(process.cwd(), 'tests', 'test-settings.json');
console.log(`Resuming project from: ${testSettingsPath}`);

try {
    await ResumeProject(testSettingsPath);
    console.log('Project resume completed successfully!');
} catch (error) {
    console.error('Project resume failed:', error);
    console.error('Error stack:', error.stack);
}
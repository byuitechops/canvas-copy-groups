const { main } = require('./main.js');
const { prompt } = require('enquirer');

async function getInput() {
    const question = [
        {
            type: 'input',
            name: 'sourceCourseID',
            message: 'Source Course ID (copying from):'
        }, {
            type: 'input',
            name: 'targetCourseID',
            message: 'Target Course ID (copying to):'
        }, {
            type: 'toggle',
            name: 'deleteProjectGroups',
            message: 'Delete the default "Project Groups" category?',
            choices: [
                { name: 'yes', message: 'y', value: true, hint: '(default)' },
                { name: 'no', message: 'n', value: false },
            ]
        }, {
            type: 'toggle',
            name: 'logReport',
            message: 'Log report to console?',
            choices: [
                { name: 'yes', message: 'y', value: true },
                { name: 'no', message: 'n', value: false },
            ]
        }
    ];

    var answers = await prompt(question);
    return answers;
}

async function getOutput(report) {
    console.log(report);
}

function handleError(error) {
    console.error(error)
    return;
}

await function start() {
    getInput()
        .then(main)
        .then(getOutput)
        .catch(handleError);
}

start();
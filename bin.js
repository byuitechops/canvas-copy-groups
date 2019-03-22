const main = require('./main.js');
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

function handleError(error) {
    console.error(error)
    return;
}

function start() {
    getInput()
        .then(main)
        .catch(handleError);
}

start();
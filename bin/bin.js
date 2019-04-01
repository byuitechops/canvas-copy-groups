const main = require('../main.js');
const { prompt } = require('enquirer');

// Ask user for inputs w/ Enquirer
async function getInput() {
    const question = [
        {
            type: 'input',
            name: 'sourceCourseID',
            message: 'Source Course ID (copying from)'
        }, {
            type: 'input',
            name: 'targetCourseID',
            message: 'Target Course ID (copying to)'
        }, {
            type: 'toggle',
            name: 'deleteProjectGroups',
            message: 'Delete the default "Project Groups" category?',
            choices: [
                { name: 'yes', message: 'y', value: true, hint: '(default)' },
                { name: 'no', message: 'n', value: false },
            ],
            autofocus: 0
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

// if enabled at getInput(), log report object to console
function getOutput(report) {
    if (report.enabled) {
        console.log('\nREPORT:');
        console.log(report.data);
        console.log('ERRORS:');
        console.log(report.errors);
    }
}

function handleError(error) {
    console.error(error)
    return;
}

// start promise chain
function start() {
    getInput()
        .then(main)
        .then(getOutput)
        .catch(handleError);
}

start();
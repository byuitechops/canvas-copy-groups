const main = require('../main.js');
const { prompt } = require('enquirer');
const d3 = require('d3-dsv');
const fs = require('fs');

// Ask user for inputs w/ Enquirer
async function getInput() {
    const questions = [
        {
            type: 'input',
            name: 'path',
            message: 'File path to CSV list location',
            initial: './test.csv'
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
    var answers = await prompt(questions);

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

// loop through all course pairs in CSV and return promise chain
function loop(answers) {
    var courseList = '';
    try {
        courseList = d3.csvParse(fs.readFileSync(answers.path, 'utf-8'));
    } catch (err) {
        throw `ERROR: Path \'${answer.path}\' could not be read.`;
    }
    return Promise.all(courseList.map(coursePair => {
        // return main() promise chain sending in INPUT object
        return main({
            sourceCourseID: coursePair.source,
            targetCourseID: coursePair.target,
            deleteProjectGroups: answers.deleteProjectGroups,
            logReport: answers.logReport
        }).then(getOutput);
    }));
}

function handleError(error) {
    console.error(error)
    return;
}

// start promise chain
function start() {
    getInput()
        .then(loop)
        .catch(handleError);
}

start();
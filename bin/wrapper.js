const main = require('../main.js');
const { prompt } = require('enquirer');
const d3 = require('d3-dsv');
const fs = require('fs');

async function getInput() {
    const question = {
        type: 'input',
        name: 'path',
        message: 'File path to CSV list location',
        initial: './test.csv'
    };
    var answer = await prompt(question);

    try {
        const courseList = d3.csvParse(fs.readFileSync(answer.path, 'utf-8'));
        return courseList;
    } catch (err) {
        throw `ERROR: Path \'${answer.path}\' could not be read.`;
    }
}

function getOutput(report) {
    if (report.enabled) {
        console.log('\nREPORT:');
        console.log(report.data);
        console.log('ERRORS:');
        console.log(report.errors);
    }
}

function loop(courseList) {
    return Promise.all(courseList.map(coursePair => {
        return main({
            sourceCourseID: coursePair.source,
            targetCourseID: coursePair.target,
            deleteProjectGroups: true,
            logReport: false
        }).then(getOutput);
    }));
}

function handleError(error) {
    console.error(error)
    return;
}

function start() {
    getInput()
        .then(loop)
        .catch(handleError);
}

start();
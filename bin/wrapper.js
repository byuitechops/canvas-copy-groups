#!/usr/bin/env node

const main = require('../main.js');
const { prompt } = require('inquirer');
const d3 = require('d3-dsv');
const fs = require('fs');
const path = require('path');
const pMap = require('p-map');
const pretty = require('json-stringify-pretty-compact');

// Ask user for inputs w/ Enquirer
async function getInput() {
    const questions = [
        {
            type: 'input',
            name: 'path',
            message: 'File path to CSV list location',
            suffix: ':',
            default: './test.csv',
            validate: input => { return fs.existsSync(path.resolve(input)) ? true : false; }
        }, {
            type: 'confirm',
            name: 'deleteProjectGroups',
            message: 'Delete the default "Project Groups" category?',
            default: true
        }, {
            type: 'confirm',
            name: 'logReport',
            message: 'Log report to console?',
            default: true
        }
    ];
    var answers = await prompt(questions);
    return answers;
}

// if enabled at getInput(), log report object to console
function printOutput(reports, answers) {
    // record the number of errors to make it easy to find
    reports = reports.map(report => {
        report.errorCount = report.errors.length;
        return report
    })

    // print you want
    if (reports[0].enabled) {
        console.log('COMPLETE');
    }

    // write the file out
    var fileName = path.parse(answers.path).name
    fileName = `${fileName}Report_${Date.now()}.json`
    fs.writeFileSync(fileName, pretty(reports), 'utf8');
    console.log(`Wrote: ${fileName}`)
}

// loop through all course pairs in CSV and return promise chain
function loop(answers) {
    var courseList = '';
    try {
        courseList = d3.csvParse(fs.readFileSync(answers.path, 'utf-8'));
    } catch (err) {
        throw `ERROR: Path \'${answer.path}\' could not be read.`;
    }
    // make It Fit main
    courseList = courseList.map(coursePair => ({
        sourceCourseID: coursePair.source,
        targetCourseID: coursePair.target,
        deleteProjectGroups: answers.deleteProjectGroups,
        logReport: answers.logReport
    }))
    // .slice(9,10);

    // send back after main
    return pMap(courseList, main, { concurrency: 1 });
}

function handleError(error) {
    console.error(error)
    return;
}

// start promise chain
async function start() {
    try {
        var answers = await getInput();
        var reports = await loop(answers);
        printOutput(reports, answers);
    } catch (error) {
        handleError(error);
    }
}

start();
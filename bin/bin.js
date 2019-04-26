#!/usr/bin/env node

const main = require('../main.js');
const { prompt } = require('inquirer');

// Ask user for inputs w/ Enquirer
async function getInput() {
    const question = [
        {
            type: 'number',
            name: 'sourceCourseID',
            message: 'Source Course ID (copying from)',
            suffix: ':',
            default: '46990'
        }, {
            type: 'number',
            name: 'targetCourseID',
            message: 'Target Course ID (copying to)',
            suffix: ':',
            default: '46992'
        }, {
            type: 'confirm',
            name: 'deleteProjectGroups',
            message: 'Delete the default "Project Groups" category?',
            default: true
        }, {
            type: 'confirm',
            name: 'deleteMatchingGroups',
            message: 'Delete existing matches in target course?',
            default: true
        }, {
            type: 'confirm',
            name: 'logReport',
            message: 'Log report to console?',
            default: true
        }
    ];
    var answers = await prompt(question);
    return answers;
}

// if enabled at getInput(), log report object to console
function getOutput(report) {
    if (report.enabled) {
        console.log("COMPLETE");
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
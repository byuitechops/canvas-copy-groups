const copyGroups = require('./main.js');
const Enquirer = require('enquirer');
const enquirer = new Enquirer();

enquirer.question('sourceCourseID', 'Source Course ID (copying from):');
enquirer.question('targetCourseID', 'Target Course ID (copying to):');
enquirer.question('deleteProjectGroups', {
    message: 'Delete the default "Project Groups" category? (y/n)',
    errorMessage: 'Must be "y" or "n"',
    validate: input => /[yn]/.test(input),
    transform: input => (input === 'y')
});

enquirer.ask()
    .then(answers => {
        return copyGroups(answers.sourceCourseID, answers.targetCourseID, answers.deleteProjectGroups);
    })
    .catch(console.error);
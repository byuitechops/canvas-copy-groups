const copyGroups = require('./main.js');
const Enquirer = require('enquirer');
const enquirer = new Enquirer();

enquirer.question('sourceCourseID', 'Source Course ID (copying from):');
enquirer.question('targetCourseID', 'Target Course ID (copying to):');
enquirer.question('deleteProjectGroups', {
    message: 'Delete the default "Project Groups" category? [y/n]',
    default: 'y',
    errorMessage: 'Must be "y" or "n"',
    validate: input => /[yn]/.test(input),
    transform: input => (input === 'y')
});

enquirer.ask().then(answers => answers).catch(console.error);
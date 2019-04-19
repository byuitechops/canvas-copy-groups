const chalk = require('chalk');

module.exports = function (report, status) {
    var message = `${report.courseID} | ${report.message}`;

    if (status === 'data') {
        console.log(chalk.green(message));
    } else if (status === 'warning') {
        console.log(chalk.yellow(message));
    } else if (status === 'error') {
        console.log(chalk.red(message));
    }

    return;
}
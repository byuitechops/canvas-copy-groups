const canvas = require('canvas-wrapper');
const logReport = require('./logReport.js');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {
    return new Promise((resolve, reject) => {
        canvas.get(`/api/v1/courses/${targetCourseID}/group_categories?search_term=Project Groups`, (err, categories) => {
            if (err) return reject(err);

            var projectGroups = categories.find(c => c.name === 'Project Groups');

            if (projectGroups !== undefined) {
                canvas.delete(`/api/v1/group_categories/${projectGroups.id}`, (err) => {
                    if (err) {
                        // TODO: this never called
                        var reportError = {
                            courseID: targetCourseID,
                            message: 'Error deleting "Project Groups" default category from course',
                            Group: "Project Groups",
                            ID: projectGroups.id
                        };
                        if (report.enabled) logReport(reportError, 'error');
                        report.errors.push(reportError);
                        report.errorCount++;
                        err.message += " source: " + sourceCourseID + "| target: " + targetCourseID;
                        return reject(err);
                    }
                    var reportData = {
                        courseID: targetCourseID,
                        message: '"Project Groups" default category has been removed from course',
                        Group: "Project Groups",
                        ID: projectGroups.id
                    };
                    if (report.enabled) logReport(reportData, 'data');
                    report.data.push(reportData);
                    resolve({
                        groupData
                    });
                });
            } else {
                var reportWarning = {
                    courseID: targetCourseID,
                    message: '"Project Groups" default category was not found in course'
                };
                if (report.enabled) logReport(reportWarning, 'warning');
                report.data.push(reportWarning);
                resolve({
                    groupData
                });
            }
        });
    });
};
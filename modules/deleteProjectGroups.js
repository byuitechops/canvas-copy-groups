const canvas = require('canvas-wrapper');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {
    return new Promise((resolve, reject) => {
        canvas.get(`/api/v1/courses/${targetCourseID}/group_categories?search_term=Project Groups`, (err, categories) => {
            if (err) return reject(err);

            var projectGroups = categories.find(c => c.name === 'Project Groups');
            console.log(projectGroups);

            if (projectGroups !== undefined) {
                canvas.delete(`/api/v1/group_categories/${projectGroups.id}`, (err) => {
                    if (err) {
                        // TODO: this never called
                        console.log(" source: " + sourceCourseID + "| target: " + targetCourseID);
                        err.message += " source: " + sourceCourseID + "| target: " + targetCourseID
                        return reject(err);
                    }
                    report.data.push({ message: `Default \"Project Groups\" Group Category has been removed from course ${targetCourseID}.` });
                    resolve({
                        groupData
                    });
                });
            } else {
                report.data.push({ message: `\"Project Groups\" default category was not found in course ${targetCourseID}.` });
                resolve({
                    groupData
                });
            }
        });
    });
};
const canvas = require('canvas-wrapper');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {
    return new Promise((resolve, reject) => {
        canvas.get(`/api/v1/courses/${targetCourseID}/group_categories?search_term=Project Groups`, (err, categories) => {
            if (err) return reject(err);

            var projectGroups = categories.find(c => c.name === 'Project Groups');

            if (projectGroups !== undefined) {
                canvas.delete(`/api/v1/group_categories/${projectGroups.id}`, (err) => {
                    if (err) return reject(err);
                    console.message('Default "Project Groups" Group Category has been removed.');
                    resolve({
                        groupData
                    });
                });
            } else {
                console.log('\"Project Groups\" default category was not found in the course.');
                resolve({
                    groupData
                });
            }
        });
    });
};
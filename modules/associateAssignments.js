// Get all assignments
// Filter to only group assignments
// Identify which group each is attached to, store the name of the assignment (and type?)
// Associate same assignment on other side
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData) => {

    function getAssignments() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourseID}/assignments`, (err, assignments) => {
                if (err) return reject(err);
                /* Filter to just group assignments */
                assignments = assignments.filter(assignment => assignment.group_category_id !== null);
                assignments.forEach(assignment => {
                    // Get the group category this assignment is under
                    var owningCategory = groupData.find(category => assignment.group_category_id === category.id);
                    // Save the assignment titles
                    if (owningCategory.assignments) {
                        owningCategory.assignments.push(assignment.name);
                    } else {
                        owningCategory.assignments = [assignment.name];
                    }
                });
                resolve();
            });
        });
    }

    function getTargetAssignment(assignmentTitle) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${targetCourseID}/assignments?search_term=${assignmentTitle}`, (err, assignments) => {
                if (err) return reject(err);
                // Give us the first one found (since it should only ever return one)
                resolve(assignments[0]);
            });
        });
    }

    function associateAssignment(category, callback) {

        asyncLib.each(category.assignments, (assignmentTitle, eachCallback) => {
            getTargetAssignment(assignmentTitle)
                .then(assignment => {

                    if (!assignment) {
                        console.log(`${assignmentTitle} assignment does not exist in the target course. Unable to associate items.`);
                        eachCallback(null);
                        return;
                    }

                    canvas.put(`/api/v1/courses/${targetCourseID}/assignments/${assignment.id}`, {
                        assignment: {
                            group_category_id: category.newCategory.id
                        }
                    }, (err, updatedAssignment) => {
                        if (err) {
                            eachCallback(err);
                            return;
                        }
                        console.log('ASSIGNMENT ASSOCIATED: ' + updatedAssignment.name);
                        eachCallback(null);
                    });
                })
                .catch(eachCallback);

        }, (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    }

    function associateTargetAssignments() {
        return new Promise((resolve, reject) => {
            var categoriesWithAssignments = groupData.filter(category => category.assignments !== undefined);

            asyncLib.each(categoriesWithAssignments, associateAssignment, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    return new Promise((resolve, reject) => {
        getAssignments()
            .then(associateTargetAssignments)
            .then(() => {
                console.log('Assignment association complete.');
                resolve(groupData);
            })
            .catch(reject);
    });
};
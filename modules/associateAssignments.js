const canvas = require('canvas-wrapper');
const asyncLib = require('async');


module.exports = (sourceCourseID, targetCourseID, groupData, report) => {

    /* Retrieves all assignments from source course and then filters to just group assignments */
    function getSourceAssignments() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourseID}/assignments`, (err, assignments) => {
                if (err) return reject(err);
                assignments = assignments.filter(assignment => assignment.group_category_id !== null);
                resolve(assignments);
            });
        });
    }

    /* Determines the ID for the corresponding group in the target course */
    function getNewGroup(assignment) {
        return new Promise((resolve, reject) => {
            var category = groupData.find(category => category.id === assignment.group_category_id);
            if (category) {
                assignment.newCategory = category.newCategory;
                resolve(assignment);
            } else {
                reject(new Error(`ASSIGNMENT: Unable to identify the category ${assignment.name} originally belonged to.`));
            }
        });
    }

    /* Gets the corresponding assignment from the target course, then assigns it to the assignment object */
    function getTargetAssignment(assignment) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${targetCourseID}/assignments?search_term=${assignment.name}`, (err, assignments) => {
                if (err) return reject(err);
                if (assignments[0].name === assignment.name) {
                    assignment.targetAssignment = assignments[0];
                    resolve(assignment);
                } else {
                    report.errors.push({ ASSIGNMENT: `Unable to locate ${assignment.name} in the Target Course.` });
                    reject(null);
                }
            });
        });
    }

    /* Gets the overrides for the assignment, then assigns them to the assignment object */
    function getOverrides(assignment) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourseID}/assignments/${assignment.id}/overrides`, (err, overrides) => {
                if (err) return reject(err);
                assignment.overrides = overrides;
                resolve(assignment);
            });
        });
    }

    /* Associates the assignment to its group in the target course and gives it it's overrides */
    function associateAssignment(assignment) {
        return new Promise((resolve, reject) => {
            var putObj = {
                assignment: {
                    group_category_id: assignment.newCategory.id,
                    only_visible_to_overrides: assignment.only_visible_to_overrides
                }
            };

            // Associate the Target Course assignment with its group
            canvas.put(`/api/v1/courses/${targetCourseID}/assignments/${assignment.targetAssignment.id}`, putObj, (err, updatedAssignment) => {
                if (err) return reject(err);
                console.log('Assignments Associated', {
                    'Name': updatedAssignment.name,
                    'ID': updatedAssignment.id,
                    'Group Category': assignment.newCategory.name,
                    'Overrides Set': assignment.has_overrides
                });
                resolve(assignment);
            });
        });
    }

    function updateOverrides(assignment) {
        return new Promise((resolve, reject) => {
            asyncLib.each(assignment.overrides, (oldOverride, callback) => {

                function getNewGroupID() {
                    var oldCategory = groupData.find(category => {
                        return category.groups.some(group => group.id === oldOverride.group_id);
                    });
                    var oldGroup = oldCategory.groups.find(group => group.id === oldOverride.group_id);
                    return assignment.newCategory.newGroups.find(newGroup => oldGroup.name === newGroup.name).id;
                }

                var postObj = {
                    'assignment_override': {
                        'title': oldOverride.title,
                        'group_id': getNewGroupID(),
                        'due_at': oldOverride.due_at,
                        'unlock_at': oldOverride.unlock_at,
                        'lock_at': oldOverride.lock_at
                    }
                };

                canvas.post(`/api/v1/courses/${targetCourseID}/assignments/${assignment.targetAssignment.id}/overrides`,
                    postObj,
                    (err, updatedAssignment) => {
                        if (err) {
                            callback(err);
                            return;
                        }
                        console.log('Assignment Overrides Updated', {
                            'Name': assignment.name,
                            'ID': updatedAssignment.id,
                            'Group Category': assignment.newCategory.name,
                        });
                        callback(null);
                    });

            }, err => {
                if (err) return reject(err);
                resolve(assignment);
            });
        });
    }

    return new Promise((resolve, reject) => {
        getSourceAssignments()
            .then(assignments => {
                asyncLib.each(assignments, (assignment, callback) => {
                    getNewGroup(assignment)
                        .then(getTargetAssignment)
                        .then(getOverrides)
                        .then(associateAssignment)
                        .then(updateOverrides)
                        .then((updatedAssignment) => {
                            callback(null);
                        })
                        .catch(err => {
                            if (err === null) {
                                callback(null);
                            } else {
                                callback(err);
                            }
                        });
                }, (err) => {
                    if (err) return reject(err);
                    resolve(groupData);
                });
            })
            .catch(reject);
    });
};
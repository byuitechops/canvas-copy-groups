const retrieveGroupData = require('./modules/retrieveGroupData.js');
const createCategories = require('./modules/createCategories.js');
const createGroups = require('./modules/createGroups.js');
const associateAssignments = require('./modules/associateAssignments.js');
const associateDiscussions = require('./modules/associateDiscussions.js');
const deleteProjectGroups = require('./modules/deleteProjectGroups.js');

module.exports = (sourceCourseID, targetCourseID, deleteDefaultCategory) => {
    return new Promise((resolve, reject) => {
        retrieveGroupData(sourceCourseID)
            .then(groupData => {
                return createCategories(sourceCourseID, targetCourseID, groupData);
            })
            .then(groupData => {
                return createGroups(sourceCourseID, targetCourseID, groupData);
            })
            .then(groupData => {
                return associateAssignments(sourceCourseID, targetCourseID, groupData);
            })
            .then(groupData => {
                return associateDiscussions(sourceCourseID, targetCourseID, groupData);
            })
            .then(groupData => {
                if (deleteDefaultCategory === true) {
                    return deleteProjectGroups(sourceCourseID, targetCourseID, groupData);
                }
                return groupData;
            })
            .then(resolve)
            .catch(reject);
    });


};
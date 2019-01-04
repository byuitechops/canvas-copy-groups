const retrieveGroupData = require('./modules/retrieveGroupData.js');
const deleteExistingMatches = require('./modules/deleteExistingMatches.js');
const createCategories = require('./modules/createCategories.js');
const createGroups = require('./modules/createGroups.js');
const associateAssignments = require('./modules/associateAssignments.js');
const associateDiscussions = require('./modules/associateDiscussions.js');
const deleteProjectGroups = require('./modules/deleteProjectGroups.js');
const Logger = require('logger');
const logger = new Logger('Group Copy');

module.exports = (sourceCourseID, targetCourseID, deleteDefaultCategory) => {
    retrieveGroupData(sourceCourseID, logger)
        .then(groupData => {
            return deleteExistingMatches(sourceCourseID, targetCourseID, groupData, logger);
        })
        .then(groupData => {
            return createCategories(sourceCourseID, targetCourseID, groupData, logger);
        })
        .then(groupData => {
            return createGroups(sourceCourseID, targetCourseID, groupData, logger);
        })
        .then(groupData => {
            return associateAssignments(sourceCourseID, targetCourseID, groupData, logger);
        })
        .then(groupData => {
            return associateDiscussions(sourceCourseID, targetCourseID, groupData, logger);
        })
        .then(groupData => {
            if (deleteDefaultCategory === true) {
                return deleteProjectGroups(sourceCourseID, targetCourseID, groupData, logger);
            }
            return {groupData, logger};
        })
        .catch((e)=> console.error(e))
        .finally(() =>{
            logger.htmlReport('./htmlReport');
            logger.jsonReport('./jsonReport');
        });
};

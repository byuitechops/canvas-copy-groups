const retrieveGroupData = require('./modules/retrieveGroupData.js');
const deleteExistingMatches = require('./modules/deleteExistingMatches.js');
const createCategories = require('./modules/createCategories.js');
const createGroups = require('./modules/createGroups.js');
const associateAssignments = require('./modules/associateAssignments.js');
const associateDiscussions = require('./modules/associateDiscussions.js');
const deleteProjectGroups = require('./modules/deleteProjectGroups.js');

module.exports = (input, i) => {
    const source = input.sourceCourseID,
        target = input.targetCourseID;
    if (i === undefined) {
        i = '';
    }
    console.log(i, source, '->', target);

    let report = { source: source, target: target, enabled: input.logReport, data: [], errors: [] };
    return retrieveGroupData(source, report)
        .then(groupData => {
            return deleteExistingMatches(source, target, groupData, report);
        })
        .then(groupData => {
            return createCategories(source, target, groupData, report);
        })
        .then(groupData => {
            return createGroups(source, target, groupData, report);
        })
        .then(groupData => {
            return associateAssignments(source, target, groupData, report);
        })
        .then(groupData => {
            return associateDiscussions(source, target, groupData, report);
        })
        .then(groupData => {
            if (input.deleteProjectGroups === true) {
                return deleteProjectGroups(source, target, groupData, report);
            }
            return {
                groupData,
                report
            };
        })
        .catch((e) => console.error(e))
        .then(() => {
            return report;
        });
};
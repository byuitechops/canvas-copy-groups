const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {

    function makeGroups(category, callback) {

        function makeGroup(group, eachCallback) {
            /* Settings for our new group we're about to create */
            var groupSettings = {
                name: group.name,
                description: group.description,
                is_public: group.is_public,
                join_level: group.join_level,
                storage_quota_mb: group.storage_quota_mb
            };

            /* POST to create new group inside a category */
            canvas.post(`/api/v1/group_categories/${category.newCategory.id}/groups`, groupSettings, (err, newGroup) => {
                if (err) {
                    eachCallback(err);
                    return;
                }
                category.newCategory.newGroups.push(newGroup);
                console.log('Groups Created', {
                    'Name': newGroup.name,
                    'ID': newGroup.id,
                    'Category': category.newCategory.name
                });
                eachCallback(null);
            });
        }

        category.newCategory.newGroups = [];

        asyncLib.each(category.groups, makeGroup, (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    }

    return new Promise((resolve, reject) => {
        asyncLib.each(groupData, makeGroups, (err) => {
            if (err) return reject(err);
            resolve(groupData);
        });
    });
};
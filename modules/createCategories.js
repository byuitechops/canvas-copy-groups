const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData) => {

    function makeCategories(category, callback) {

        var categorySettings = {
            name: category.name,
            self_signup: category.self_signup,
            group_limit: category.group_limit,
            auto_leader: category.auto_leader,
        };

        /* POST to create new category */
        canvas.post(`/api/v1/courses/${targetCourseID}/group_categories`, categorySettings, (err, newCategory) => {
            if (err) {
                callback(err);
                return;
            }
            category.newCategory = newCategory;
            console.log('GROUP CATEGORY CREATED: ' + newCategory.name);
            callback(null);
        });
    }

    return new Promise((resolve, reject) => {
        asyncLib.each(groupData, makeCategories, (err) => {
            if (err) return reject(err);
            resolve(groupData);
        });
    });
};
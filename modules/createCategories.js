const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData, logger) => {

    function getExistingCategory(category) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${targetCourseID}/group_categories?search_term=${category.name}`, (err, categories) => {
                if (err) return reject(err);
                var existingCategory = categories.find(existingCat => existingCat.name === category.name);
                resolve(existingCategory);
            });
        });
    }

    function makeCategories(category, index, callback) {

        var categorySettings = {
            name: category.name,
            self_signup: category.self_signup,
            group_limit: category.group_limit,
            auto_leader: category.auto_leader,
        };

        /* POST to create new category */
        canvas.post(`/api/v1/courses/${targetCourseID}/group_categories`, categorySettings, (err, newCategory) => {
            if (err) {
                // If it is already being used, remove the category from the category array
                if (err.message.includes('already in use')) {
                    logger.warning(`CATEGORY EXISTS: ${category.name} is already in the course.`);
                    getExistingCategory(newCategory);
                    category.existing = true;
                    callback(null);
                    return;
                }
                callback(err);
            } else {
                category.newCategory = newCategory;
                category.existing = false;
                logger.log('Group Categories Created', {
                    'Name': newCategory.name,
                    'ID': newCategory.id,
                });
                callback(null);
            }
        });
    }

    return new Promise((resolve, reject) => {
        asyncLib.eachOf(groupData, makeCategories, (err) => {
            if (err) return reject(err);
            groupData = groupData.filter(category => {
                return !category.existing;
            });
            if (groupData.length === 0) {
                reject(new Error('Source course either contains no groups, or the target course already has all of them.'));
            }
            resolve(groupData);
        });
    });
};
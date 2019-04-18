const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {

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
                    report.errors.push({ 'CATEGORY_EXISTS': `${category.name} is already in course ${targetCourseID}.` });
                    // getExistingCategory(newCategory);
                    category.existing = true;
                    callback(null);
                    return;
                }
                callback(err);
            } else {
                category.newCategory = newCategory;
                category.existing = false;
                report.data.push({
                    courseID: targetCourseID,
                    message: 'Group Categories Created',
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
            
            if (groupData.length === 0) {
                report.errors.push({ 'NO_GROUPS': `Source course contains no groups.` });
                // reject(new Error('Source course contains no groups.'));
            }
            
            groupData = groupData.filter(category => {
                return !category.existing;
            });
            
            // if (groupData.length === 0) {
            //     report.errors.push({ 'HAS_ALL_GROUPS': 'The target course already has all of them.' });
            //     // reject(new Error('The target course already has all of them.'));
            // }
            resolve(groupData);
        });
    });
};
const canvas = require('canvas-wrapper');
const asyncLib = require('async');
const logReport = require('./logReport.js');

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
                    var reportError = {
                        courseID: targetCourseID,
                        message: `${category.name} is already in course`,
                        categoryId: newCategory.id,
                        categoryName: category.name
                    };
                    if (report.enabled) logReport(reportError, 'error');
                    report.errors.push(reportError);
                    report.errorCount++;
                    // getExistingCategory(newCategory);
                    category.existing = true;
                    callback(null);
                    return;
                }
                callback(err);
            } else {
                category.newCategory = newCategory;
                category.existing = false;
                var reportData = {
                    courseID: targetCourseID,
                    message: `Group category ${newCategory.name} created`,
                    Name: newCategory.name,
                    ID: newCategory.id,
                };
                if (report.enabled) logReport(reportData, 'data');
                report.data.push(reportData);
                callback(null);
            }
        });
    }

    return new Promise((resolve, reject) => {
        asyncLib.eachOf(groupData, makeCategories, (err) => {
            if (err) return reject(err);

            if (groupData.length === 0) {
                var reportError = {
                    courseID: sourceCourseID,
                    message: 'Source course contains no groups.'
                };
                if (report.enabled) logReport(reportError, 'error');
                report.errors.push(reportError);
                report.errorCount++;
                reject(new Error(`Source course ${sourceCourseID} contains no groups.`));
            }

            groupData = groupData.filter(category => {
                return !category.existing;
            });

            // if (groupData.length === 0) {
            //     var reportError = {
            //         courseID: targetCourseID,
            //         message: 'The target course already has all categories'
            //     };
            //     if (report.enabled) logReport(reportError, 'error');
            //     report.errors.push(reportError);
            //     report.errorCount++;
            //     // reject(new Error('The target course already has all of them.'));
            // }
            resolve(groupData);
        });
    });
};
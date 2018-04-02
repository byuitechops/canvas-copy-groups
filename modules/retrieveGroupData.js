const canvas = require('canvas-wrapper');

async function getCategories(sourceCourseID) {
    return new Promise((resolve, reject) => {

        canvas.get(`/api/v1/courses/${sourceCourseID}/group_categories`, (err, categories) => {
            if (err) return reject(err);
            else {
                resolve(categories);
            }
        });

    });
}

async function getGroups(sourceCourseID, categories) {
    return new Promise((resolve, reject) => {

        canvas.get(`/api/v1/courses/${sourceCourseID}/groups`, (err, groups) => {
            if (err) return reject(err);
            else {
                categories.forEach(category => {
                    category.groups = groups.filter(g => g.group_category_id === category.id);
                });
                resolve(categories);
            }
        });

    });
}

module.exports = async (sourceCourseID) => {
    try {
        var categories = await getCategories(sourceCourseID);
        var groupData = await getGroups(sourceCourseID, categories);
        return groupData;
    } catch (e) {
        console.log(e);
    }

};
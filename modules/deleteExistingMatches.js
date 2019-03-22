const canvas = require('canvas-api-wrapper');

module.exports = (sourceCourseID, targetCourseID, groupData, report) => {

    async function removeMatchingCategories() {
        // get the categories from each course
        let targetCategories = await canvas.get(`/api/v1/courses/${targetCourseID}/group_categories`);
        let sourceCategories = await canvas.get(`/api/v1/courses/${sourceCourseID}/group_categories`);

        // find the ones that match
        let categoriesToDelete = sourceCategories.reduce((acc, sourceCategory) => {
            targetCategories.forEach(targetCategory => {
                if (sourceCategory.name === targetCategory.name) {
                    // must be targetCategory for the correct id, or you will be deleting from the source course
                    acc.push(targetCategory);
                }
            })
            return acc;
        }, []);

        // delete the ones that match from the targetCourse
        for (let i = 0; i < categoriesToDelete.length; i++) {
            await canvas.delete(`/api/v1/group_categories/${categoriesToDelete[i].id}`);
            console.log('Deleted Category from course', {
                categoryId: categoriesToDelete[i].id,
                categoryName: categoriesToDelete[i].name,
                courseId: targetCourseID
            });
        }
        return groupData;
    }

    return removeMatchingCategories();
};
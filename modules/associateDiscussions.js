const canvas = require('canvas-wrapper');
const asyncLib = require('async');


module.exports = (sourceCourseID, targetCourseID, groupData, report) => {

    /* Retrieves all discussions from source course and then filters to just group discussions */
    function getSourceDiscussions() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourseID}/discussion_topics`, (err, discussions) => {
                if (err) return reject(err);
                discussions = discussions.filter(discussion => discussion.group_category_id !== null);
                resolve(discussions);
            });
        });
    }

    /* Determines the ID for the corresponding group in the target course */
    function getNewGroup(discussion) {
        return new Promise((resolve, reject) => {
            var category = groupData.find(category => category.id === discussion.group_category_id);
            if (category) {
                discussion.newCategory = category.newCategory;
                resolve(discussion);
            } else {
                reject(new Error(`DISCUSSION: Unable to identify the category ${discussion.title} originally belonged to.`));
            }
        });
    }

    /* Gets the corresponding discussion from the target course, then assigns it to the discussion object */
    function getTargetDiscussion(discussion) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${targetCourseID}/discussion_topics?search_term=${discussion.title}`, (err, discussions) => {
                if (err) return reject(err);
                if (discussions[0].title === discussion.title) {
                    discussion.targetDiscussion = discussions[0];
                    resolve(discussion);
                } else {
                    report.errors.push({ DISCUSSION: `Unable to locate ${discussion.title} in the Target Course.` });
                    reject(null);
                }
            });
        });
    }

    /* Associates the discussion to its group in the target course and gives it it's overrides */
    function associateDiscussion(discussion) {
        return new Promise((resolve, reject) => {
            var putObj = {
                group_category_id: discussion.newCategory.id,
            };

            // Associate the Target Course discussion with its group
            canvas.put(`/api/v1/courses/${targetCourseID}/discussion_topics/${discussion.targetDiscussion.id}`, putObj, (err, updatedDiscussion) => {
                if (err) return reject(err);
                report.data.push({
                    message: 'Discussions Associated',
                    'Name': updatedDiscussion.title,
                    'ID': updatedDiscussion.id,
                    'Group Category': discussion.newCategory.name,
                });
                resolve(discussion);
            });
        });
    }

    return new Promise((resolve, reject) => {
        getSourceDiscussions()
            .then(discussions => {
                asyncLib.each(discussions, (discussion, callback) => {
                    getNewGroup(discussion)
                        .then(getTargetDiscussion)
                        .then(associateDiscussion)
                        .then((updatedDiscussion) => {
                            callback(null);
                        })
                        .catch(err => {
                            if (err === null) {
                                callback(null);
                            } else {
                                callback(err);
                            }
                        });
                }, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            })
            .catch(reject);
    });
};
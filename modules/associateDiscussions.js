// Get all discussions
// Filter to only group discussions
// Identify which group each is attached to, store the name of the discussion (and type?)
// Associate same discussion on other side
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (sourceCourseID, targetCourseID, groupData) => {

    function getDiscussions() {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${sourceCourseID}/discussion_topics`, (err, discussions) => {
                if (err) return reject(err);
                /* Filter to just group discussions */
                discussions = discussions.filter(discussion => discussion.group_category_id !== null);
                discussions.forEach(discussion => {
                    // Get the group category this discussion is under
                    var owningCategory = groupData.find(category => discussion.group_category_id === category.id);
                    // Save the discussion titles
                    if (owningCategory.discussions) {
                        owningCategory.discussions.push(discussion.title);
                    } else {
                        owningCategory.discussions = [discussion.title];
                    }
                });
                resolve();
            });
        });
    }

    function getTargetDiscussion(discussionTitle) {
        return new Promise((resolve, reject) => {
            canvas.get(`/api/v1/courses/${targetCourseID}/discussion_topics?search_term=${discussionTitle}`, (err, discussions) => {
                if (err) return reject(err);
                // Give us the first one found (since it should only ever return one)
                resolve(discussions[0]);
            });
        });
    }

    function associateDiscussion(category, callback) {

        asyncLib.each(category.discussions, (discussionTitle, eachCallback) => {
            getTargetDiscussion(discussionTitle)
                .then(discussion => {

                    if (!discussion) {
                        console.log(`${discussionTitle} discussion does not exist in the target course. Unable to associate items.`);
                        eachCallback(null);
                        return;
                    }

                    canvas.put(`/api/v1/courses/${targetCourseID}/discussion_topics/${discussion.id}`, {
                        group_category_id: category.newCategory.id
                    }, (err, updatedDiscussion) => {
                        if (err) {
                            eachCallback(err);
                            return;
                        }
                        console.log('DISCUSSION ASSOCIATED: ' + updatedDiscussion.title);
                        eachCallback(null);
                    });
                })
                .catch(e => eachCallback(e));

        }, (err) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    }

    function associateTargetDiscussions() {
        return new Promise((resolve, reject) => {
            var categoriesWithDiscussions = groupData.filter(category => category.discussions !== undefined);
            asyncLib.each(categoriesWithDiscussions, associateDiscussion, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    return new Promise((resolve, reject) => {
        getDiscussions()
            .then(associateTargetDiscussions)
            .then(() => {
                console.log('Discussion association complete.');
                resolve(groupData);
            })
            .catch(reject);
    });
};
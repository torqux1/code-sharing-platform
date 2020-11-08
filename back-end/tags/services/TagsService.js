const TagModel = require('../models/Tag').model;



//Should be checked if transaction is better here, so in case of a fail, we do a rollback....
exports.updateInsertTags = function (tagNames) {
    
     const promiseArr = tagNames.map(tagName => {
        return TagModel.findOneAndUpdate({ name: tagName },
            { $inc: { countUsedInSnippets: 1 } }, { upsert: true, 'new': true });
    });

    return Promise.all(promiseArr);
};

exports.decreaseTagsUsage = function (tagIds) {

    const promiseArr = tagIds.map(tagId => {
        return TagModel.findOneAndUpdate({ _id: tagId }, {$inc: { countUsedInSnippets: -1 }}, {'new': true });
    });

    return Promise.all(promiseArr);
};
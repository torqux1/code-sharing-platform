const SnippetModel = require('../models/Snippet').model;
const TagModel = require('../../tags/models/Tag').model;


exports.likeSnippet = function (snippetId, userId) {
    return SnippetModel.findOneAndUpdate({ _id: snippetId }, { $inc: { countLikes: 1 }, $addToSet: {likedBy: userId} })
        .then((result) => {
            const tagIds = result.tags;

            return tagIds.map(tagId => {
                return TagModel.findOneAndUpdate({ _id: tagId }, { $inc: {countLikesInSnippets: 1} }, { new: true } )});
        })
        .then((promiseArr) => {
            return Promise.all(promiseArr);
        });
};

exports.dislikeSnippet = function (snippetId, userId) {
    return SnippetModel.findOneAndUpdate({ _id: snippetId }, { $inc: { countLikes: -1 }, $pull: {likedBy: userId} })
        .then((result) => {
            const tagIds = result.tags;

            return tagIds.map(tagId => {
                return TagModel.findOneAndUpdate({ _id: tagId }, { $inc: {countLikesInSnippets: -1} }, { new: true } )});
        })
        .then((promiseArr) => {
            return Promise.all(promiseArr);
        });
};
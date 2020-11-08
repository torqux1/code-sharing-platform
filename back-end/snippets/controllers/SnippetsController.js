const SnippetModel = require('../models/Snippet');
const errors = require('../../common/config/errors');
const errorsStatuses = require('../../common/config/map-errors-http-statuses');
const config = require('../config/constants');
const TagService = require('../../tags/services/TagsService');
const SnippetService = require('../services/SnippetService');


class SnippetsController {
    constructor() {

    }

    insert(req, res, next) {
        req.body.creator = req.user.userId;

        TagService.updateInsertTags(req.body.tags)
            .then((result) => {
                req.body.tags = result.map(tagResult => tagResult._id);

                return SnippetModel.createSnippet(req.body);
            })
            .then((result) => {
                res.status(errorsStatuses[errors.SUCC_CREATED.code]).send({
                    id: result._id
                });
            })
            .catch((err) => next(err));
    };

    list(req, res, next) {
        const relations = req.query.relations;

        let limit = req.query.limit && req.query.limit <= config.DEFAULT_SELECT_MAX_LIMIT ? parseInt(req.query.limit) : config.DEFAULT_SELECT_LIMIT;
        let page = 0;

        if (req.query && req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }

        let searchCriteria = (!req.user)? {'isShared': 1} 
            : (!req.user.isAdmin ? { $or:[ {'isShared': 1}, {'creator': req.user.userId} ] } : {});
        
        SnippetModel.list(limit, page, relations, searchCriteria)
            .then((result) => {
                if(!result.data.length){
                    return res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
                }
                if(relations && relations.includes('creator')) {
                    result.data.forEach(snippet => {
                        snippet.creator.password = undefined;
                    });
                }
                res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
            })
            .catch(err => next(err));
    };

    getById(req, res, next) {
        SnippetModel.findById(req.params.snippetId)
            .then((result) => {
                if(!result.length){
                    return res.status(errorsStatuses[errors.NO_SUCH_RESOURCE.code]).send(errors.NO_SUCH_RESOURCE);
                }
                res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
            })
            .catch(err => next(err));
    };

    updateById(req, res, next) {
        let promise;

        switch(req.body.action) {
            case config.actions.LIKE_SNIPPET:
                promise = SnippetService.likeSnippet(req.params.snippetId, req.user.userId);
              break;
            case config.actions.DISLIKE_SNIPPET:
                promise = SnippetService.dislikeSnippet(req.params.snippetId, req.user.userId);
              break;
            default:
                promise = SnippetModel.updateSnippet(req.params.snippetId, req.body);
        }


        promise.then((result) => {
            if(!result){
                return res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({updated: 0});
            }
            res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
        })
        .catch(err => next(err));
    };

    removeById(req, res, next) {
        SnippetModel.findById(req.params.snippetId)
            .then((result) => {
                if(!result.length) {
                    return res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({deleted: 0});
                }
                
                const tagIds = result[0].tags;

                let promise = (!tagIds.length) ? Promise.resolve() : TagService.decreaseTagsUsage(tagIds);

                promise.then(() => SnippetModel.removeById(req.params.snippetId))
                    .then((result) => {
                        res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({ deleted: result.deletedCount });
                    })
                    .catch(err => next(err));
        });
    };
    
}

module.exports = SnippetsController;
const TagModel = require('../models/Tag');
const errors = require('../../common/config/errors');
const errorsStatuses = require('../../common/config/map-errors-http-statuses');
const config = require('../config/constants');


class TagsController {
    constructor() {
    }

    insert(req, res, next) {
        return TagModel.findByName(req.body.name).then((tag) => {
            if (tag[0]) {
                return Promise.reject(errors.TAG_ALRAEDY_EXISTS);
            }
            return TagModel.createTag(req.body)
        })
        .then((result) => {
            res.status(errorsStatuses[errors.SUCC_CREATED.code]).send({
                id: result._id
            });
        })
        .catch(err => next(err));   
    };

    

    list(req, res, next) {
        const limit = req.query && req.query.limit && req.query.limit <= config.DEFAULT_SELECT_MAX_LIMIT ?
            parseInt(req.query.limit) : config.DEFAULT_SELECT_LIMIT;
        const sort = req.query && req.query.sort;
        let page = 0;

        if (req.query && req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
        TagModel.list(limit, page, sort)
            .then(result => res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result))
            .catch(err => next(err));
    };

    getById(req, res, next) {
        TagModel.findById(req.params.tagId)
            .then(result => {
                if (!result[0]) {
                    return res.status(errorsStatuses[errors.NO_SUCH_RESOURCE.code]).send(errors.NO_SUCH_RESOURCE);
                }
                res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
            })
            .catch(err => next(err));
    };

    updateById(req, res, next) {
        TagModel.updateTag(req.params.tagId, req.body)
            .then((result) => {
                if (!result) {
                    return res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({ updated: 0 });
                }
                res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send(result);
            })
            .catch(err => next(err));
    };
};

module.exports = TagsController;
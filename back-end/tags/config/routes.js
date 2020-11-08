const TagsController = require('../controllers/TagsController');
const TagsValidationSchema = require('../validationSchemas/TagsValidationSchema');
const auth = require('../../authorization/controllers/AuthorizationController').auth;
const schemaValidator = require('../../common/middlewares/schema-validator');


exports.routesConfig = function (app) {

    const tagsController = new TagsController();

    app.get('/tags', [
        auth,
        schemaValidator(TagsValidationSchema.index),
        tagsController.list.bind(tagsController)
    ]);

    app.get('/tags/:tagId', [
        auth,
        schemaValidator(TagsValidationSchema.show),
        tagsController.getById.bind(tagsController)
    ]);

    app.post('/tags', [
        auth,
        schemaValidator(TagsValidationSchema.store),
        tagsController.insert.bind(tagsController)
    ]);

    app.patch('/tags/:tagId', [
        auth,
        schemaValidator(TagsValidationSchema.update),
        tagsController.updateById.bind(tagsController)
    ]);
    
};

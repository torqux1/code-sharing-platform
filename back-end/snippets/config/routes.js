const SnippetsController = require('../controllers/SnippetsController');
const SnippetsValidationSchema = require('../validationSchemas/SnippetsValidationSchema');
const auth = require('../../authorization/controllers/AuthorizationController').auth;
const permissionControl = require('../../common/middlewares/permission-control');
const schemaValidator = require('../../common/middlewares/schema-validator');


exports.routesConfig = function (app) {

    const snippetsController = new SnippetsController();

    app.get('/snippets', [
        auth,
        schemaValidator(SnippetsValidationSchema.index),
        snippetsController.list.bind(snippetsController)
    ]);

    app.get('/snippets/:snippetId', [
        auth,
        schemaValidator(SnippetsValidationSchema.show),
        snippetsController.getById.bind(snippetsController)
    ]);

    app.post('/snippets', [
        auth,
        schemaValidator(SnippetsValidationSchema.store),
        snippetsController.insert.bind(snippetsController)
    ]);

    app.patch('/snippets/:snippetId', [
        auth,
        schemaValidator(SnippetsValidationSchema.update),
        snippetsController.updateById.bind(snippetsController)
    ]);

    app.delete('/snippets/:snippetId', [
        auth,
        permissionControl.adminPermissionLevelRequired,
        schemaValidator(SnippetsValidationSchema.destroy),
        snippetsController.removeById.bind(snippetsController)
    ]);
};

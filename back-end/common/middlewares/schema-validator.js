const Ajv = require('ajv');
const errors = require('../config/errors');
const errorsStatuses = require('../config/map-errors-http-statuses');

module.exports = function(schema){
    const schemaValidator = function (req, res, next) {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req);

        if (!valid) {
            return res.status(errorsStatuses[errors.VALIDATION_ERR.code]).send({code: errors.VALIDATION_ERR.code, description: ajv.errors});
        }
        next();
    }

    return schemaValidator;
};
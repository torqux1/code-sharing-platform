const errors = require('../config/errors');
const errorsStatuses = require('../config/map-errors-http-statuses');

exports.adminPermissionLevelRequired = (req, res, next) => {
    if (req.user && req.user.isAdmin === 1) {
        return next();
    } 
    return res.status(errorsStatuses[errors.ACCESS_FORBIDDEN.code]).send(errors.ACCESS_FORBIDDEN);
};


const errors = require('../config/errors');
const errorsStatuses = require('../config/map-errors-http-statuses');

module.exports = function (err, req, res, next) {
  if (!err.code && !err.description) {
    return res.status(errorsStatuses[errors.SERVER_ERROR.code]).send(errors.SERVER_ERROR);
    
  }
  res.status(errorsStatuses[err.code]).send(err);
};
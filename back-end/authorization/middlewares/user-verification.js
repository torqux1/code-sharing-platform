const crypto = require('crypto');
const UserModel = require('../../users/models/User');
const errors = require('../../common/config/errors');
const errorsStatuses = require('../../common/config/map-errors-http-statuses');

exports.isEmailAndPasswordMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email).then((user) => {
        if (!user[0]) {
            return res.status(errorsStatuses[errors.NOT_AUTHORIZED.code]).send(errors.NOT_AUTHORIZED);
        }
        let passwordFields = user[0].password.split('$')
        let salt = passwordFields[0];
        let hash = crypto
            .createHmac('sha512', salt)
            .update(req.body.password)
            .digest('base64');

        if (hash === passwordFields[1]) {
            req.body.userId = user[0]._id;
            req.body.isAdmin = user[0].isAdmin;
            
            return next();
        }
            
        return res.status(errorsStatuses[errors.NOT_AUTHORIZED.code]).send(errors.NOT_AUTHORIZED);
    });
};
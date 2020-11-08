
const UsersController = require('../../users/controllers/UsersController');
const UrlPattern = require('url-pattern');
const authFreePaths = require('../../common/config/auth-free-paths');
const errors = require('../../common/config/errors');
const errorsStatuses = require('../../common/config/map-errors-http-statuses');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION_SECONDS}  = require('../../common/config/env.config');


exports.login = (req, res) => {
    try {
        const token = jwt.sign({
            userId: req.body.userId,
            email: req.body.email,
            isAdmin: req.body.isAdmin
        }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_SECONDS });
        
        res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({
            userId: req.body.userId,
            accessToken: token,
            isAdmin: req.body.isAdmin
        });
    } catch (err) {
        res.status(errorsStatuses[errors.SERVER_ERROR.code]).send({ errors: err });
    }
};

exports.register = (req, res, next) => {
    const usersController = new UsersController();

    usersController.insert(req, res, next)
        .then((results) => {
            if (results) {
                res.status(errorsStatuses[errors.SUCC_OPERATION.code]).send({
                    userId: results._id,
                    email: results.email,
                });
            }
        })
        .catch((err) => { 
            if(err.code === errors.USER_ALREADY_EXISTS.code){
                return res.status(errorsStatuses[err.code]).send(err); 
            }
            next(err);
        });
};

exports.auth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const isRouteAuthFree = authFreePaths.some(function (routeConfig) {
            if (req.method !== routeConfig.METHOD) return false;

            const routePattern = new UrlPattern(routeConfig.PATH_PATTERN);
            return routePattern.match(req.path);
        });

        if (isRouteAuthFree) return next();

        return res.status(errorsStatuses[errors.NOT_AUTHORIZED.code]).send(errors.NOT_AUTHORIZED);
    }

    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            isAdmin: decoded.isAdmin
        }
        next();
    } catch (error) {
        return res.status(errorsStatuses[errors.NOT_AUTHORIZED.code]).send(errors.NOT_AUTHORIZED);
    }
};
const clientEndpoint = require('./../config/env.config').clientEndpoint

module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // Comment in case only react server should have access 
    res.header('Access-Control-Allow-Origin', clientEndpoint)
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    return next();
};
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./common/config/env.config');
const errorCatcher = require('./common/middlewares/error-catcher');

const AuthorizationRouter = require('./authorization/config/routes');
const TagsRouter = require('./tags/config/routes');
const SnippetsRouter = require('./snippets/config/routes');


app.use(require('./common/middlewares/cross-domain'));
app.use(bodyParser.json());


AuthorizationRouter.routesConfig(app);
TagsRouter.routesConfig(app);
SnippetsRouter.routesConfig(app);

app.use(errorCatcher);

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
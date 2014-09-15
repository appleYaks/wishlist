var api          = require('./api');
var renderApp    = require ('./renderApp');
var staticRoutes = require('./staticRoutes');
var fallThrough  = require('./fallThrough');
var testing      = require('./testing');

var init = function (app) {
    api.init(app);
    renderApp.init(app);
    staticRoutes.init(app);
    testing.init(app);
    fallThrough.init(app);
};

module.exports = {
    init: init,
};

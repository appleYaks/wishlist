var api          = require('./api');
var renderApp    = require ('./renderApp');
var staticRoutes = require('./staticRoutes');
var fallThrough  = require('./fallThrough');

var init = function (app) {
    api.init(app);
    renderApp.init(app);
    staticRoutes.init(app);
    fallThrough.init(app);
};

module.exports = {
    init: init,
};

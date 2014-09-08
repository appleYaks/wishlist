var app;

var init = function (appInstance) {
  app = appInstance;

  setupRoutes();
};

var renderApp = function (req, res, next) {
  app.db.groups.browse().then(function (groups) {
    var preload = { groups: groups };

    res.render('app', {
      preloadGroups: JSON.stringify(preload)
    });
  });
};

var setupRoutes = function () {
  app.get('/', renderApp);
  app.get('/groups', renderApp);
  app.get('/groups/:group_id', renderApp);
  app.get('/groups/:group_id/edit', renderApp);
  app.get('/groups/:group_id/items', renderApp);
  app.get('/groups/:group_id/items/:item_id', renderApp);
  app.get('/groups/:group_id/items/:item_id/edit', renderApp);
};

module.exports = {
  init: init,
};

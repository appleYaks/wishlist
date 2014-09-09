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
  app.get('/groups/:groupId', renderApp);
  app.get('/groups/:groupId/edit', renderApp);
  app.get('/groups/:groupId/items', renderApp);
  app.get('/groups/:groupId/items/:itemId', renderApp);
  app.get('/groups/:groupId/items/:itemId/edit', renderApp);
};

module.exports = {
  init: init,
};

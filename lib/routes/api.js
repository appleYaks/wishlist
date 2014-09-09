var app, api;

var init = function (appInstance) {
  app = appInstance;
  api = app.api.v1;

  setupRoutes();
};

var setupRoutes = function () {
  app.get('/api/v1/groups', api.groups.browse);
  app.get('/api/v1/groups/:groupId', api.groups.read);

  app.get('/api/v1/groups/:groupId/items', api.items.browse);
  app.get('/api/v1/items', api.items.browse);
  app.get('/api/v1/items/:itemId', api.items.read);
};

module.exports = {
  init: init,
};

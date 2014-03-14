define([
  'core/config',
  'ember-data',

  'models/Group',
  'models/Item',

  'views/Application',
  'controllers/Application',
  'routes/Application',

  'views/Groups',
  'controllers/Groups',
  'routes/Groups',

  'views/Items',
  'controllers/Items',
  'routes/Items',

  'routes/Item',

  'controllers/Index',
  'routes/Index',

  'router',
],

function(
  Config,
  DS,

  Group,
  Item,

  ApplicationView,
  ApplicationController,
  ApplicationRoute,

  GroupsView,
  GroupsController,
  GroupsRoute,

  ItemsView,
  ItemsController,
  ItemsRoute,

  ItemRoute,

  IndexController,
  IndexRoute,

  Router
){
  'use strict';

  var App = {
    // models
    Group: Group,
    Item: Item,

    // views
    ApplicationView: ApplicationView,
    GroupsView: GroupsView,
    ItemsView: ItemsView,

    // controllers
    ApplicationController: ApplicationController,
    IndexController: IndexController,
    GroupsController: GroupsController,
    ItemsController: ItemsController,

    // routes
    ApplicationRoute: ApplicationRoute,
    IndexRoute: IndexRoute,
    GroupsRoute: GroupsRoute,
    ItemsRoute: ItemsRoute,
    ItemRoute: ItemRoute,

    // router
    Router: Router,

    // various setup config
    ApplicationAdapter: DS.RESTAdapter.extend({
      namespace: 'api/v1',
    }),

    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true,

    ready: function () {

    },
  };

  return App;
});

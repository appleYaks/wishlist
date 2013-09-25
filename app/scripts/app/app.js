define([
  'core/config',
  'ember-data',

  'models/Person',

  'views/Application',
  'controllers/Application',
  'routes/Application',

  'controllers/Index',
  'routes/Index',

  'views/ScoobyCard',
  'routes/ScoobyCard',

  'views/Reattach',

  'router',
],

function(
  Config,
  DS,

  Person,

  ApplicationView,
  ApplicationController,
  ApplicationRoute,

  IndexController,
  IndexRoute,

  ScoobyCardView,
  ScoobyCardRoute,

  ReattachView,

  Router
){
  'use strict';

  var App = {
    // models
    Person: Person,

    // views
    ApplicationView: ApplicationView,
    ScoobyCardView: ScoobyCardView,
    ReattachView: ReattachView,

    // controllers
    ApplicationController: ApplicationController,
    IndexController: IndexController,

    // routes
    ApplicationRoute: ApplicationRoute,
    IndexRoute: IndexRoute,
    ScoobyCardRoute: ScoobyCardRoute,

    // router
    Router: Router,

    // various setup config
    ApplicationAdapter: DS.RESTAdapter.extend({
      namespace: 'api/v1',
    }),
    LOG_TRANSITIONS: true,
  };

  return App;
});

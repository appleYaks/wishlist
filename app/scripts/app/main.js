;(function(root) {
  'use strict';

  requirejs.config({
    paths: {
      json3: '../../bower_components/json3/lib/json3',
      JST: 'templates',

      // these shims are all needed because Ember doesn't yet support AMD
      jquery: 'core/shims/jquery-shim',
      ember: 'core/shims/ember-shim',
      'ember-data': 'core/shims/ember-data-shim',
      // needed for precompiled templates
      handlebars: 'core/shims/handlebars.runtime-shim',
    },
    shim: {
      ember: {
        deps: ['handlebars', 'jquery'],
        exports: 'Ember'
      },
      'ember-data': {
        deps: ['ember'],
        exports: 'DS'
      },
      handlebars: {
        deps: [],
        exports: 'Handlebars',
      },
    },
  });

  require(['app', 'ember', 'ember-data'], function(App, Ember, DS) {
    var appName = 'App';
    root[appName] = App = Ember.Application.createWithMixins(App);
  });
})(this);

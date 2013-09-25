/*globals require*/
'use strict';

var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /\.spec\.js$/.test(file);
});

require.config({
  // Karma serves files from '/base'
  baseUrl: '/base/app/scripts/app',

  paths: {
    json3: '../../bower_components/json3/lib/json3',
    JST: '../../../.tmp/scripts/app/templates',

    // these shims are all needed because Ember doesn't yet support AMD
    jquery: 'core/shims/jquery-shim',
    ember: 'core/shims/ember-shim',
    'ember-data': 'core/shims/ember-data-shim',
    // 'ember-mocha-adapter': '../../bower_components/ember-mocha-adapter/adapter',
    // needed for precompiled templates
    handlebars: 'core/shims/handlebars.runtime-shim',

    chai: '../../bower_components/chai/chai',
    'sinon-chai': '../../bower_components/sinon-chai/lib/sinon-chai',

    has: '../../bower_components/has/has',
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
    // 'ember-mocha-adapter': {
    //   deps: ['ember'],
    // },
    handlebars: {
      deps: [],
      exports: 'Handlebars',
    },
  },
});

// workaround for Chai with PhantomJS:
// https://github.com/chaijs/chai/issues/107
var should;

var root = this;

require(['chai', 'sinon-chai', 'has', 'ember', 'ember-data'/*, 'ember-mocha-adapter'*/],
function (chai, sinonChai, has, Ember) {
  var $ = Ember.$;

  window.chai = chai;
  chai.use(sinonChai);

  // Helper definition for setting the error message in `should` syntax
  // http://stackoverflow.com/questions/11527474/chai-mocha-identify-should-assertion
  chai.use(function(_chai, utils) {
    _chai.Assertion.addMethod('withMessage', function(msg) {
      utils.flag(this, 'message', msg);
    });
  });

  window.assert = chai.assert;
  window.expect = chai.expect;
  should = chai.should();
  chai.Assertion.includeStack = true;

  window.has = has;

  Ember.Test.adapter = Ember.Test.MochaAdapter.create();

  $(document).ready(function () {
    $('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');
    $('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 384px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('body');

    require(['app'], function(App) {
      var appName = 'App';

      Ember.run(function () {
        root[appName] = App = Ember.Application.createWithMixins(App);

        // pollutes test result output in the command line
        App.LOG_TRANSITIONS = false;

        // needed to communicate with server (it's running on a different port)
        App.ApplicationAdapter.reopen({
          host: 'http://localhost:9000'
        });

        App.rootElement = '#ember-testing';
        App.setupForTesting();

        /////////////////////////////////////
        // setup any new test helpers here //
        /////////////////////////////////////

        // Ember.Test.registerHelper('loginUser', function(app, username, password) {
        //   visit('secured/path/here')
        //   .fillIn('#username', username)
        //   .fillIn('#password', username)
        //   .click('.submit')
        //
        //   // Helpers that cause asynchronous behavior should return wait() to return
        //   // a promise that will resolve when that asynchronous behavior is complete.
        //   // The parameter is the value to be returned when the promise competes.
        //   // Returning 'app' makes chaining with other helpers possible. Happens by default.
        //   !!!!!!!!!! not sure if this above is true. wait(val) may just return val to the
        //     first argument of the next .then(val) in the chain
        //   return wait(app);
        // });

        // Ember.Test.registerHelper('dblclick', function(app, selector, context) {
        //   var $el = findWithAssert(selector, context);
        //   Ember.run(function() {
        //     $el.dblclick();
        //   });
        //   return wait();
        // });


        /////////////////////////////////////
        //        End Test Helpers         //
        /////////////////////////////////////

        App.injectTestHelpers();
        App.advanceReadiness();
      });

      require(tests, function () { window.__karma__.start(); });
    });
  });
});

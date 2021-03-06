var express      = require('express');
var hbs          = require('express-hbs');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var compression  = require('compression');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var app;

var init = function (appInstance) {
  app = appInstance;

  setupEnvironment();
  setupViewEngine();
  setupMiddleware();
  setupCORS();
};

/*
* Set app settings depending on environment mode.
* Express automatically sets the environment to 'development'
*/
var setupEnvironment = function () {
  if (process.env.NODE_ENV === 'production' || (process.argv.length >= 3 && process.argv[2] === 'production')) {
    console.log('Setting production env variable');
    app.set('env', 'production');
    app.disable('verbose errors');

    // this 'dev' variable is available to templates
    app.locals.dev = false;
  } else {
    app.locals.dev = true;
    app.enable('verbose errors');
  }

  if (process.env.NODE_ENV === 'test' || (process.argv.length >= 3 && process.argv[2] === 'test')) {
    console.log('Setting test env variable');
    app.set('env', 'test');
  }
};

var setupViewEngine = function () {
  if (/^development|test$/.test(app.get('env'))) {
    app.engine('hbs', hbs.express3({
      partialsDir: app.root + '/views/partials'
    }));

    app.set('views', app.root + '/views');
  } else if (app.get('env') === 'production') {
    app.engine('hbs', hbs.express3({
      partialsDir: app.root + '/dist/views/partials'
    }));

    app.set('views', app.root + '/dist/views');
  }

  app.set('view engine', 'hbs');
};

var setupMiddleware = function () {
  if (app.get('env') !== 'production') {
    app.use(logger('dev'));
  }

  app.use(favicon(app.root + '/app/favicon.ico'));
  app.use(cookieParser(/* 'some secret key to sign cookies' */ 'keyboardcat' ));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
};

// ## CORS middleware
//
// http://www.html5rocks.com/en/tutorials/cors/#toc-adding-cors-support-to-the-server
// https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
//
// this is necessary to run Karma tests with Ember.
// testing with Ember is integrated testing, which requires
// the server API. Since Karma runs the app on a different port,
// we'll need to configure Cross-Origin Resource Sharing (CORS)
// in order to send data from the server running on this port.
var setupCORS = function () {
  if (/^development|test$/.test(app.get('env')) && process.argv.length >= 4 && !isNaN(+process.argv[3])) {
    console.log('Setting up CORS');

    var allowCrossDomain = function(req, res, next) {
      var isCORSRequest = false;

      if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:' + process.argv[3]);
        isCORSRequest = true;
      }

      if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        isCORSRequest = true;
      }

      if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        isCORSRequest = true;
      }

      // gives the value in seconds for how long the response to the preflight
      // request can be cached for without sending another preflight request
      // if (isCORSRequest) {
      //   res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
      // }

      // intercept OPTIONS method
      if (isCORSRequest && 'OPTIONS' === req.method) {
        res.status(200).end();
      } else {
        next();
      }
    };

    app.use(allowCrossDomain);
  }
};

module.exports = {
  init: init,
};

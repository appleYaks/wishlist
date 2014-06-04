var express  = require('express');
var hbs      = require('express-hbs');

/*
* Set app settings depending on environment mode.
    * Express automatically sets the environment to 'development'
*/
var setupEnvironment = function (app) {
  if (process.env.NODE_ENV === 'production' || (process.argv.length >= 3 && process.argv[2] === 'production')) {
    console.log('Setting production env variable');
    app.set('env', 'production');
    app.disable('verbose errors');

    // this 'dev' variable is available to Jade templates
    app.locals.dev = false;
  } else {
    app.locals.dev = true;
    app.use(express.logger('dev'));
    app.enable('verbose errors');
  }

  if (process.env.NODE_ENV === 'test' || (process.argv.length >= 3 && process.argv[2] === 'test')) {
    console.log('Setting test env variable');
    app.set('env', 'test');
  }
};

var setupViewEngine = function (app) {
  if (/^development|test$/.test(app.get('env'))) {
    app.engine('hbs', hbs.express3({
      partialsDir: __dirname + '/views/partials'
    }));

    app.set('views', __dirname + '/views');
  } else if (app.get('env') === 'production') {
    app.engine('hbs', hbs.express3({
      partialsDir: __dirname + '/dist/views/partials'
    }));

    app.set('views', __dirname + '/dist/views');
  }

  app.set('view engine', 'hbs');
};

var setupMiddleware = function (app) {
  // app.use(express.favicon());
  app.use(express.cookieParser(/* 'some secret key to sign cookies' */ 'keyboardcat' ));

  // use is not preferred to express.json(), .urlencoded(), and .multipart() below
  // https://groups.google.com/forum/#!msg/express-js/iP2VyhkypHo/5AXQiYN3RPcJ
  // app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  // enable only when accepting files
  app.use(express.multipart());

  app.use(express.compress());
  app.use(express.methodOverride());


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
        res.send(200);
      } else {
        next();
      }
    };

    app.use(allowCrossDomain);
  }
};

var bootstrap = function (app) {
  setupEnvironment(app);
  setupViewEngine(app);
  setupMiddleware(app);
};

module.exports = bootstrap;

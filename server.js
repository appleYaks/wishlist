'use strict';

/*
 * Express Dependencies
 */
var express  = require('express');
var app      = express();
var database = require('./lib/database/sequelize');
var bootstrap = require('./lib/bootstrap');
var port     = process.env.PORT || 9000;
var api;

/*
 * App methods and libraries
 */
app.root = __dirname;
app.config = require('./config.js');
app.api = require('./lib/api');
app.classes = require('./lib/classes');
app.db = database.db;
app.db.raw = database.raw;

// propagate app instance throughout app methods
app.api.init(app);

// make some shorthand
api = app.api.v1;

database.init(app).then(function () {
  console.log('database initialized!');
}, function (databaseErr) {
  console.log('database initialization failed due to:', databaseErr);
  process.exit(2);
}).then(function () {
  bootstrap(app);

  // "app.router" positions our routes
  // above the middleware defined below,
  // this means that Express will attempt
  // to match & call routes _before_ continuing
  // on, at which point we assume it's a 404 because
  // no route has handled the request.
  app.use(app.router);


  // host dev files if in dev mode
  if (/^development|test$/.test(app.get('env'))) {
    app.use(express.static('.tmp'));
    app.use(express.static('app'));
  } else if (app.get('env') === 'production') {
    app.use(express.static('dist/app'));
  }


  // Since this is the last non-error-handling
  // middleware use()d, we assume 404, as nothing else
  // responded.

  // $ curl http://localhost:3000/notfound
  // $ curl http://localhost:3000/notfound -H "Accept: application/json"
  // $ curl http://localhost:3000/notfound -H "Accept: text/plain"

  app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

  // error-handling middleware, take the same form
  // as regular middleware, however they require an
  // arity of 4, aka the signature (err, req, res, next).
  // when connect has an error, it will invoke ONLY error-handling
  // middleware.

  // If we were to next() here any remaining non-error-handling
  // middleware would then be executed, or if we next(err) to
  // continue passing the error, only error-handling middleware
  // would remain being executed, however here
  // we simply respond with an error page.

  app.use(function(err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || (err.status = 500));

    console.error('Server error catch-all says: ', err);

    // prevent users from seeing specific error messages in production
    if (app.get('env') !== 'development') {
      var newErr = new Error('Something went wrong. Sorry!');
      newErr.status = err.status;
      err = newErr;
    }

    // respond depending on highest-quality accepted format
    res.format({
      json: function () {
        res.send({
          data: err,
          message: err.message
        });
      },

      html: function () {
        res.render('errors', {
          data: err,
          message: err.message
        });
      },

      text: function () {
        res.send('Error ' + err.status);
      }
    });
  });


  /*
  * Routes
  */
  function renderApp (req, res, next) {
    app.db.groups.browse().then(function (groups) {
      var preload = { groups: groups };

      res.render('app', {
        preloadGroups: JSON.stringify(preload)
      });
    });
  }

  app.get('/', renderApp);

  app.get('/api/v1/groups', api.groups.browse);
  app.get('/api/v1/groups/:group_id', api.groups.read);

  app.get('/api/v1/groups/:group_id/items', api.items.browse);
  app.get('/api/v1/items', api.items.browse);
  app.get('/api/v1/items/:item_id', api.items.read);

  app.get('/groups', renderApp);
  app.get('/groups/:group_id', renderApp);
  app.get('/groups/:group_id/edit', renderApp);
  app.get('/groups/:group_id/items', renderApp);
  app.get('/groups/:group_id/items/:item_id', renderApp);
  app.get('/groups/:group_id/items/:item_id/edit', renderApp);

  app.get('/index', function (req, res) {
    res.send(200, require('fs').readFileSync('index.html', {encoding: 'utf8'}));
  });

  /*
  * Status Code pages
  */
  app.get('/404', function(req, res, next){
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
  });

  app.get('/403', function(req, res, next){
    // trigger a 403 error
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
  });

  app.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'));
  });


  app.listen(port);
  console.log('Express started on port ' + port);
}).catch(function (err) {
  console.error('App encountered an error:', err);
  process.exit(1);
});


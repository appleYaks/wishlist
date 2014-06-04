'use strict';

/*
 * Express Dependencies
 */
var express  = require('express');
var app      = express();
var database = require('./lib/database/sequelize');
var boostrap = require('./lib/bootstrap');
var port     = 9000;


/*
 * App methods and libraries
 */
app.config = require('./config.js');
app.api = require('./lib/api');
app.classes = require('./lib/classes');
app.db = database.db;

// propagate app instance throughout app methods
app.api.use(app);

database.init(app).then(function () {
  console.log('database initialized!');
}, function (databaseErr) {
  console.log('database initialization failed due to:', databaseErr);
  process.exit(2);
}).then(function () {
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
    app.db.groups.read.all(function (err, groups) {
      if (err) {
        return next(err);
      }

      var preload = { groups: groups };

      res.render('app', {
        preloadGroups: JSON.stringify(preload)
      });
    });
  }

  app.get('/', renderApp);

  app.get('/api/v1/groups', app.api.v1.groups.get.all);
  app.get('/api/v1/groups/:group_id', app.api.v1.groups.get.groupById);

  app.get('/api/v1/groups/:group_id/items', app.api.v1.items.get.itemsByGroup);
  app.get('/api/v1/items', app.api.v1.items.get.all);
  app.get('/api/v1/items/:item_id', app.api.v1.items.get.itemById);

  app.get('/groups', renderApp);
  app.get('/groups/:group_id', renderApp);
  app.get('/groups/:group_id/edit', renderApp);
  app.get('/groups/:group_id/items', renderApp);
  app.get('/groups/:group_id/items/:item_id', renderApp);
  app.get('/groups/:group_id/items/:item_id/edit', renderApp);


  app.get('/normal', function(req, res, next) {
    res.render('normal');
  });

  app.get('/index', function (req, res) {
    res.send(200, require('fs').readFileSync('index.html', {encoding: 'utf8'}));
  });

  app.post('/normal', function (req, res) {
    console.log('picture was', req.body, req.files);
    res.send(200);
  });

  // app.get('/api/v1/people', app.api.v1.people.getAll);
  // app.get('/api/v1/peopleError', app.api.v1.people.getError);

  // app.put('/api/v1/people/:id', function (req, res) {
  //   // the database library would normally save
  //   // the record and return the updated record.
  //   req.body.person.id = req.params.id;
  //   res.send(req.body);
  // });


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


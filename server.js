'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var app = express();
var port = 9000;


/*
 * App methods and libraries
 */
app.api = require('./lib/api');
app.classes = require('./lib/classes');
app.db = require('./lib/database/mongoose');

// propagate app instance throughout app methods
app.api.use(app);
app.db.use(app);


/*
 * Set app settings depending on environment mode.
 * Express automatically sets the environment to 'development'
 */
if (process.env.NODE_ENV === 'production' || (process.argv.length >= 3 && process.argv[2] === 'production')) {
  console.log('Setting production env variable');
  app.set('env', 'production');

  // this 'dev' variable is available to Jade templates
  app.locals.dev = false;
} else {
  app.locals.dev = true;
}

if (process.env.NODE_ENV === 'test' || (process.argv.length >= 3 && process.argv[2] === 'test')) {
  console.log('Setting test env variable');
  app.set('env', 'test');
}

/*
 * Config
 */
if (/^development|test$/.test(app.get('env'))) {
  app.use(express.logger('dev'));

  app.set('views', __dirname + '/views');
} else if (app.get('env') === 'production') {
  app.set('views', __dirname + '/dist/views');
}

app.set('view engine', 'jade');

// app.use(express.favicon());
app.use(express.cookieParser(/* 'some secret key to sign cookies' */ 'keyboardcat' ));

// use is not preferred to express.json(), .urlencoded(), and .multipart() below
// https://groups.google.com/forum/#!msg/express-js/iP2VyhkypHo/5AXQiYN3RPcJ
// app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
// enable only when accepting files
// app.use(express.multipart());

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

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node server.js
if (app.get('env') === 'production') {
  app.disable('verbose errors');
}


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

    var preload = { group: groups };

    res.render('app', {
      preloadGroups: JSON.stringify(preload)
    });
  });
}

// app.get('/', function(req, res, next) {
//   // we use a direct database connection here
//   // because the API would have sent JSON itself
//   app.db.getPeople(function (err, people) {
//     if (err) {
//       return next(err);
//     }

//     // keep one item off so the client can reload "new" data dynamically
//     var allButLast = people.slice(0, people.length-1);

//     res.render('app', {
//       bootstrap: 'var bootstrap = ' + JSON.stringify(allButLast) + ';',
//     });
//   });
// });

app.get('/', renderApp);

app.get('/api/v1/groups', app.api.v1.groups.all);
app.get('/api/v1/groups/:group_id', app.api.v1.groups.groupById);

app.get('/api/v1/groups/:group_id/items', app.api.v1.items.itemsByGroup);
app.get('/api/v1/items', app.api.v1.items.all);
app.get('/api/v1/items/:item_id', app.api.v1.items.itemById);

app.get('/groups', renderApp);
app.get('/groups/:group_id', renderApp);
app.get('/groups/:group_id/edit', renderApp);
app.get('/groups/:group_id/items', renderApp);
app.get('/groups/:group_id/items/:item_id', renderApp);
app.get('/groups/:group_id/items/:item_id/edit', renderApp);


app.get('/normal', function(req, res, next) {
  res.render('normal');
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

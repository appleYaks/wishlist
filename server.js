'use strict';

/*
 * Express Dependencies
 */
var express   = require('express');
var app       = express();
var database  = require('./lib/database/sequelize');
var bootstrap = require('./lib/bootstrap');
var routes    = require('./lib/routes');
var port      = process.env.PORT || 9000;

/*
 * App methods and libraries
 */
app.root = __dirname;
app.config = require('./config.js');
app.api = require('./lib/api');
app.db = database.db;
app.db.raw = database.raw;

/*
 * Kick it off
 */
database.init(app).then(function () {
  app.api.init(app);
}).then(function () {
  bootstrap.init(app);
}).then(function () {
  routes.init(app);
}).then(function () {
  app.listen(port);
  console.log('Express started on port ' + port);
}).catch(function (err) {
  console.error('App encountered an error:', err);
  process.exit(1);
});

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = require('lodash');
var when      = require('when');
var nodefn    = require('when/node');

var db        = {};
var modelsDir = __dirname + '/models';
var seed      = require('./seed');

var authenticate = function (sequelize) {
  var deferred = when.defer();

  sequelize
    .authenticate()
    .complete(nodefn.createCallback(deferred.resolver));

  return deferred.promise;
};

var sync = function (sequelize, options) {
  var deferred = when.defer();

  sequelize
    .sync(options)
    .complete(nodefn.createCallback(deferred.resolver));

  return deferred.promise;
};

var init = function (app) {
  var syncOptions = {},
      config = app.config.database;

  if (! fs.existsSync(config.filename)) {
    app.seed = true;
  }

  if (app.seed) {
    syncOptions.force = true;
  }

  var sequelize = new Sequelize('wishlist', config.username, config.password, {
    dialect: config.client,
    storage: config.filename
  });

  fs.readdirSync(modelsDir)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(modelsDir, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  return authenticate(sequelize)
    .then(sync.bind(null, sequelize, syncOptions))
    .then(seed.bind(null, sequelize, app, db));
};

module.exports = _.extend({
  init: init
}, db);


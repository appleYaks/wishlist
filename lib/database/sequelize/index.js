var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var when      = require('when');
var nodefn    = require('when/node');

var rawDB     = {};
var modelsDir = __dirname + '/models';
var seed      = require('./seed');
var dbApi     = require('./api');

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
      rawDB[model.name] = model;
    });

  Object.keys(rawDB).forEach(function(modelName) {
    if ('associate' in rawDB[modelName]) {
      rawDB[modelName].associate(rawDB);
    }
  });

  rawDB.Sequelize = Sequelize;
  rawDB.sequelize = sequelize;

  dbApi.init(rawDB);

  return authenticate(sequelize)
    .then(sync.bind(null, sequelize, syncOptions))
    .then(seed.bind(null, sequelize, app, rawDB));
};

module.exports = {
  init: init,
  raw: rawDB,
  db: dbApi
};

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var Promise   = require('bluebird');

var rawDB     = {};
var modelsDir = __dirname + '/models';
var seed      = require('./seed');
var dbApi     = require('./api');

var authenticate = function (sequelize) {
  return new Promise(function (resolve, reject) {
    sequelize
    .authenticate()
    .complete(function (err, result) {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
};

var sync = function (sequelize, options) {
  return new Promise(function (resolve, reject) {
    sequelize
    .sync(options)
    .complete(function (err, result) {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
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

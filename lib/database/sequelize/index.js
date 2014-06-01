var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = require('lodash');
var when      = require('when');

var db        = {};
var modelsDir = __dirname + '/models';

var init = function (app) {
  return when.promise(function (resolve, reject) {
    var config = app.config.database;
    console.log('config is man', config);

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

    sequelize
      .authenticate()
      .complete(function (err) {
        if (err) {
          reject(err);
        }

        resolve();
      });

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
  });
};

module.exports = _.extend({
  init: when.lift(init)
}, db);


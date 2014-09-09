'use strict';

var when = require('when');
var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res, next) {
    var options = req.params || {};

    if (options.groupId) {
      options = +options.groupId;
    }

    db.items.browse(options).then(function (items) {
      res.json(items);
    }).catch(function (err) {
      next(err);
    });
  },

  read: function (req, res, next) {
    var options = req.params || {};

    if (!options.itemId && !options.title) {
       return next(new Error('Items Read API options did not contain a title or id.'));
    }

    if (options.itemId) {
      options = +options.itemId;
    }

    return db.items.read(options).then(function (item) {
      res.json(item);
    }).catch(function (err) {
      next(err);
    })
  }
};

module.exports = methods;

'use strict';

var when = require('when');
var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res, next) {
    db.items.browse().then(function (items) {
      res.send({
        items: items
      });
    }).catch(function (err) {
      next(err);
    });
  },

  read: function (req, res, next) {
    var options = req.params || {};

    if (!options.item_id && !options.title) {
       return next(new Error('Items Read API options did not contain a title or id.'));
    }

    if (options.item_id) {
      options = +options.item_id;
    }

    return db.items.read(options).then(function (item) {
      res.json(item);
    }).catch(function (err) {
      next(err);
    })
  }
};

module.exports = methods;

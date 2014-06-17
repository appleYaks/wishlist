'use strict';

var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res) {
    db.items.browse().then(function (items) {
      res.send({
        items: items
      });
    });
  },

  read: function (req, res) {
    var options = req.options || {};

    if (!options.id && !options.title) {
      return when.reject(new Error('Items Read API options did not contain a title or id.'));
    }

    if (options.id) {
      options = +options.id;
    }

    return when.promise(function (resolve) {
      db.items.read(options).success(function (group) {
        resolve(group);
      });
    });
  }
};

module.exports = methods;

'use strict';

var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res) {
    db.groups.browse().then(function (groups) {
      res.send({
        group: groups
      });
    });
  },

  read: function (req, res) {
    var options = req.options || {};

    if (!options.id && !options.title) {
      return when.reject(new Error('Group Read API options did not contain a title or id.'));
    }

    if (options.id) {
      options = +options.id;
    }

    return when.promise(function (resolve) {
      db.groups.read(options).success(function (group) {
        resolve(group);
      });
    });
  }
};

module.exports = methods;

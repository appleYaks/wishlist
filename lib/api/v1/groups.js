'use strict';

var when = require('when');
var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res, next) {
    db.groups.browse().then(function (groups) {
      res.send({ group: groups });
    }).catch(function (err) {
      next(err);
    });
  },

  read: function (req, res, next) {
    var options = req.params || {};

    if (!options.group_id && !options.title) {
       return next(new Error('Group Read API options did not contain a title or id.'));
    }

    if (options.group_id) {
      options = +options.group_id;
    }

    return db.groups.read(options).then(function (group) {
      res.json(group);
    }).catch(function (err) {
      next(err);
    });
  }
};

module.exports = methods;

'use strict';

var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res, next) {
    db.groups.browse().then(function (groups) {
      res.json(groups);
    }).catch(next);
  },

  read: function (req, res, next) {
    var options = req.params || {};

    if (!options.groupId && !options.title) {
       return next(new Error('Group Read API options did not contain a title or id.'));
    }

    if (options.groupId) {
      options = parseInt(options.groupId, 10);

      if (isNaN(options)) {
        return next(new Error('Tried to read a group whose id was invalid!'));
      }
    }

    return db.groups.read(options).then(function (group) {
      res.json(group);
    }).catch(next);
  },

  edit: function (req, res, next) {
    var id = parseInt(req.params.groupId, 10);

    if (isNaN(id)) {
      return next(new Error('Tried to edit a group whose id was invalid!'));
    }

    return db.groups.edit(req.body, id).then(function (group) {
      res.json(group);
    }).catch(next);
  },

  add: function (req, res, next) {
    return db.groups.add(req.body).then(function (group) {
      res.json(group);
    }).catch(next);
  },

  delete: function (req, res, next) {
    var id = parseInt(req.params.groupId, 10);

    if (isNaN(id)) {
      return next(new Error('Tried to delete a group whose id was invalid!'));
    }

    return db.groups.delete(id).then(function () {
      res.status(200).end();
    }).catch(next);
  },
};

module.exports = methods;

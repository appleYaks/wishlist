'use strict';

var app, db;

var methods = {
  init: function (appInstance) {
    app = appInstance;
    db  = appInstance.db;
  },

  browse: function (req, res, next) {
    var options = req.params || {};

    if (options.groupId) {
      options = parseInt(options.groupId, 10);

      if (isNaN(options)) {
        return next(new Error('Tried to read a item whose groupId was invalid!'));
      }
    } else {
      options = {};
    }

    db.items.browse(options).then(function (items) {
      res.json(items);
    }).catch(next);
  },

  read: function (req, res, next) {
    var options = req.params || {};

    if (!options.itemId && !options.title) {
       return next(new Error('Items Read API options did not contain a title or id.'));
    }

    if (options.itemId) {
      options = parseInt(options.itemId, 10);

      if (isNaN(options)) {
        return next(new Error('Tried to read an item whose id was invalid!'));
      }
    }

    return db.items.read(options).then(function (item) {
      res.send(item);
    }).catch(next);
  },

  edit: function (req, res, next) {
    var id = parseInt(req.params.itemId, 10);

    if (isNaN(id)) {
      return next(new Error('Tried to edit an item whose id was invalid!'));
    }

    return db.items.edit(req.body, id).then(function (item) {
      res.json(item);
    }).catch(next);
  },

  add: function (req, res, next) {
    return db.items.add(req.body).then(function (item) {
      res.json(item);
    }).catch(next);
  },

  delete: function (req, res, next) {
    var id = parseInt(req.params.itemId, 10);

    if (isNaN(id)) {
      return next(new Error('Tried to delete an item whose id was invalid!'));
    }

    return db.items.delete(id).then(function () {
      res.status(200).end();
    }).catch(next);
  },
};

module.exports = methods;

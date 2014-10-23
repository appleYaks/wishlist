var Promise = require('bluebird');

var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function () {
    return db.Group.findAll();
  },

  read: function (options) {
    options = options || {};

    if (options.title) {
      options = { where: { title: options.title } };
    }

    return db.Group.find(options).then(function (group) {
      if (!group) {
        throw (new Error('could not find a non-existent group with options: ' + JSON.stringify(options)));
      }

      return group;
    });
  },

  edit: function (model, id) {
    return this.read({ where: { id: id } }).then(function (group) {
      return new Promise(function (resolve, reject) {
        group.updateAttributes(model).complete(function (validationError, group) {
          if (validationError) {
            var err = new Error('Validation Errors');
            err.errors = validationError;
            err.status = 422;
            return reject(err);
          }

          return resolve(group);
        });
      });
    });
  },

  add: function (model) {
    return new Promise(function (resolve, reject) {
      var group = db.Group.build(model);

      group.save().complete(function (validationError, group) {
        if (validationError) {
          var err = new Error('Validation Errors');
          err.errors = validationError;
          err.status = 422;
          return reject(err);
        }

        return resolve(group);
      });
    });
  },

  delete: function (id) {
    return db.Group.destroy({ id: id }).then(function () {
      return db.Item.destroy({ GroupId: id });
    });
  },
};

module.exports = methods;

var Promise = require('bluebird');

var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function (options) {
    if (typeof options === 'number') {
      options = { where : { GroupId: options } };
    }

    return db.Item.findAll(options);
  },

  read: function (options) {
    options = options || {};

    if (options.title) {
      options = { where: { title: options.title } };
    }

    return db.Item.find(options).then(function (item) {
      if (!item) {
        throw (new Error('could not find a non-existent item with options: ' + JSON.stringify(options)));
      }

      return item;
    });
  },

  edit: function (model, id) {
    return this.read({ where: { id: id } }).then(function (item) {
      return new Promise(function (resolve, reject) {
        item.updateAttributes(model).complete(function (validationError, item) {
          if (validationError) {
            var err = new Error('Validation Errors');
            err.errors = validationError;
            err.status = 422;
            return reject(err);
          }

          return resolve(item);
        });
      });
    });
  },

  add: function (model) {
    return new Promise(function (resolve, reject) {
      var item = db.Item.build(model);

      item.save().complete(function (validationError, item) {
        if (validationError) {
          var err = new Error('Validation Errors');
          err.errors = validationError;
          err.status = 422;
          return reject(err);
        }

        return resolve(item);
      });
    });
  },

  delete: function (id) {
    return db.Item.destroy({ id: id });
  },
};

module.exports = methods;

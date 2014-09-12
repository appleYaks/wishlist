var when = require('when');
var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function (options) {
    if (typeof options === 'number') {
      options = { where : { GroupId: options } };
    }

    return when.promise(function (resolve, reject) {
      db.Item.findAll(options).complete(function (err, items) {
        if (err) {
          return reject(err);
        }

        return resolve(items.map(function (item) {
          return item.values;
        }));
      });
    });
  },

  read: function (options) {
    var options = options || {};

    if (options.id) {
      options = +options.id;
    }

    return when.promise(function (resolve, reject) {
      db.Item.find(options).complete(function (err, item) {
        if (err) {
          return reject(err);
        }

        return resolve(item.values);
      });
    });
  }
};

module.exports = methods;

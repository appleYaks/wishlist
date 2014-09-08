var when = require('when');
var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function () {
    return when.promise(function (resolve, reject) {
      db.Group.findAll().complete(function (err, groups) {
        if (err) {
          return reject(err);
        }

        return resolve(groups);
      });
    });
  },

  read: function (options) {
    var options = options || {};

    if (options.id) {
      options = +options.id;
    }

    return when.promise(function (resolve, reject) {
      db.Group.find(options).complete(function (err, group) {
        if (err) {
          return reject(err);
        }

        return resolve(group.values);
      });
    });
  }
};

module.exports = methods;

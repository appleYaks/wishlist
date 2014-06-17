var when = require('when');
var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function () {
    return when.promise(function (resolve) {
      db.Group.findAll().success(function (groups) {
        resolve(groups);
      });
    });
  },

  read: function (options) {
    var options = options || {};

    if (options.id) {
      options = +options.id;
    }

    return when.promise(function (resolve) {
      db.Group.find(options).success(function (group) {
        resolve(group);
      });
    });
  }
};

module.exports = methods;

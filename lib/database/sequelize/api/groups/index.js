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
  }
};

module.exports = methods;

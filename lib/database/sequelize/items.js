var when = require('when');
var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function () {
    return when.promise(function (resolve) {
      db.Item.findAll().success(function (items) {
        resolve(items);
      });
    });
  }
};

module.exports = methods;

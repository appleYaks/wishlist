var when = require('when');
var db;

var methods = {
  init: function (rawDB) {
    db = rawDB;
  },

  browse: function () {
    return when.promise(function (resolve, reject) {
      db.Item.findAll().complete(function (err, items) {
        if (err) {
          return reject(err);
        }

        return resolve(items);
      });
    });
  }
};

module.exports = methods;

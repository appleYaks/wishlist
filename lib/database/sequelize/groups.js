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

    if (options.id) {
      options = +options.id;
    }

    return db.Group.find(options).then(function (group) {
      if (!group) {
        throw (new Error('could not find a non-existent group with options: ' + JSON.stringify(options)));
      }

      return group;
    });
  },
};

module.exports = methods;

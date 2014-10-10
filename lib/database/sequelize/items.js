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

    if (options.id) {
      options = +options.id;
    }

    return db.Item.find(options).then(function (item) {
      if (!item) {
        throw (new Error('could not find a non-existent item with options: ' + JSON.stringify(options)));
      }

      return item;
    });
  }
};

module.exports = methods;

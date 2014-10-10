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

  edit: function (model, id) {
    var self = this;

    return db.Group.update(model, { id: id }).then(function () {
      return self.read({ id: id });
    });
  },

  add: function (model) {
    return db.Group.create(model);
  },

  delete: function (id) {
    return db.Group.destroy({ id: id });
  },
};

module.exports = methods;

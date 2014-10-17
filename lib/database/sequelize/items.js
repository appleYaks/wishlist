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
    var self = this;

    return db.Item.update(model, { id: id }).then(function () {
      return self.read({ where: { id: id } });
    });
  },

  add: function (model) {
    return db.Item.create(model);
  },

  delete: function (id) {
    return db.Item.destroy({ id: id });
  },
};

module.exports = methods;

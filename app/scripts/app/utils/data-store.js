var DataStore = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('store', {});
  },

  addType: function (type) {
    this.store[type] = [];
  },

  findById: function (type, id) {
    var type = this.store[type],
    model;

    if (!type) {
      throw new Error('There is no model of that type in the datastore!');
    }

    model = type.filter(function (model) {
      return model.id && model.id === id;
    });

    return model;
  },

  findByKey: function (type, keyName, val) {
    var type = this.store[type],
    model;

    if (!type) {
      throw new Error('There is no model of that type in the datastore!');
    }

    model = type.filter(function (model) {
      return model[key] && model[key] === val;
    });

    return model;
  },
});

export default DataStore;

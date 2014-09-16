import parseFields from 'client/utils/parse-fields-metadata';

var DataStore = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('_store', Ember.Object.create());
  },

  clear: function () {
    for (var type in this._store) {
      if (this._store.hasOwnProperty(type) && typeof this._store[type] === 'object') {
        this._store[type].clear();
      }
    }
  },

  addType: function (type) {
    this._store[type] = Ember.ArrayProxy.create({ content: Ember.A() });
  },

  load: function (type, payload) {
    if (!this._store[type]) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    if (typeof payload !== 'object') {
      throw new Error('Payload for type ' + type + ' was not an object!', payload);
    }

    // turn `fields` metadata field from a string like "[]" into a JSON object
    parseFields(payload);

    if (!this._store[type].length) {
      this._store[type].pushObjects(payload);
      return;
    }

    if (!Array.isArray(payload) && !this._store[type].findBy('id', payload.id)) {
      this._store[type].pushObject(payload);
      return;
    }

    // now we know both payload and the modelType in the store are non-zero-length arrays
    // we need to check for collisions and update those that exist, and insert those that don't

  },

  binarySearch: function (sortedArray, options) {

  },

  all: function (type, key, val) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    if (!key || !val) {
      return modelType;
    }

    return modelType.filterBy(key, val);
  },

  findById: function (type, id) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    return modelType.findBy('id', id);
  },

  findByKey: function (type, keyName, val) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    return modelType.filterBy(keyName, val);
  },
});

export default DataStore;

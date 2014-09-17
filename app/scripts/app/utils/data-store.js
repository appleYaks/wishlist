import parseFields from 'client/utils/parse-fields-metadata';

var DataStore = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('_store', Ember.Object.create());
  },

  clear: function () {
    for (var type in this._store) {
      if (this._store.hasOwnProperty(type) && typeof this._store[type] === 'object') {
        this._store[type].get('model').clear();
      }
    }
  },

  addType: function (type) {
    // using ArrayController to sort it now makes later binary search easier
    this._store[type] = Ember.ArrayController.create({
      model: Ember.A(),
      sortProperties: ['id'],
      sortAscending: true,
    });
  },

  load: function (type, payload) {
    var modelType = this._store[type],
        emberizedItems = [],
        foundItem;

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    if (typeof payload !== 'object') {
      throw new Error('Payload for type ' + type + ' was not an object!', payload);
    }

    if (Array.isArray(payload) && payload.length === 0) {
      return;
    }

    // turn `fields` metadata field from a string like "[]" into a JSON object
    parseFields(payload);

    if (!Array.isArray(payload) || (payload.length === 1 && (payload = payload[0]))) {
      foundItem = this._binarySearch(modelType, payload.id);

      if (foundItem) {
        this._mergeObject(modelType, foundItem, payload);
      } else {
        modelType.pushObject(Ember.Object.create(payload));
      }

      return;
    }

    if (!modelType.get('length')) {
      emberizedItems = payload.map(function (obj) {
        return Ember.Object.create(obj);
      });

      this._store[type].pushObjects(emberizedItems);
      return;
    }

    // now we know both payload and the modelType in the store are non-zero-length arrays.
    // we need to check for collisions and update those that exist, and insert those that don't.
    // we also need to be extremely careful not to modify the array while we're searching it.
    payload.forEach(function (item) {
      foundItem = this._binarySearch(modelType, item.id);

      if (foundItem) {
        this._mergeObject(modelType, foundItem, item);
      } else {
        emberizedItems.push(Ember.Object.create(item));
      }
    }, this);

    modelType.pushObjects(emberizedItems);
  },

  /**
  * Use the containing array to update the properties of an object it contains and notify observers.
  * @return
  */
  _mergeObject: function (modelType, obj) {
    var args = [].slice.call(arguments, 2);
    var i, prop;

    for (i = 0; i !== args.length; ++i) {
      for (prop in args[i]) {
        if (args[i].hasOwnProperty(prop)) {
          obj.set(prop, args[i][prop]);
        }
      }
    }
  },

  /**
  * Sort the internal model array by a specified key.
  * Since the arrays are always sorted by id, searching by id offers significant speedup.
  * Uses `<` to determine whether one object's property is before another.
  *
  * @param {(String|modelType)} type A string name of the internal array representation of model data of a certain type, or the array itself.
  * @param {String} [key=id] A key name to sort by. Defaults to 'id'.
  * @return {Array} A copy of the array, but sorted by `key`.
  */
  _sortBy: function (type, key) {
    var sortedArray;

    key = key || 'id';

    if (typeof type === 'string') {
      sortedArray = this._store[type];
    } else {
      sortedArray = type;
    }

    if (key !== 'id') {
      sortedArray = sortedArray.sortBy(key);
    }

    return sortedArray;
  },

  /**
  * Search the internal model array (already sorted by `key`), for an object with type `value` in that `key`.
  *
  * @param {Array} sortedArray An array that has already been sorted by `key`.
  * @param {(String|Number|Date)} value The value to check on the current object's `key`. Anything that can be compared with `<`.
  * @param {String} [key=id] The key to search objects by within sortedArray. Defaults to 'id'.
  * @return {Object} The found object or undefined.
  */
  _binarySearch: function (sortedArray, value, key) {
    key = key || 'id';

    if (!sortedArray.get('length')) {
      return;
    }

    if (key === 'id' && value < 0) {
      return;
    }

    var beg = 0,
        end = sortedArray.get('length'),
        mid = beg + Math.floor((end - beg) / 2),
        checkedItem = sortedArray.objectAt(mid);

    while (mid !== end && checkedItem.get(key) !== value) {
      if (value < checkedItem[key]){
        end = mid;
      } else {
        beg = mid + 1;
      }

      mid = beg + Math.floor((end - beg) / 2);
      checkedItem = sortedArray.objectAt(mid);
    }

    if (mid === end) {
      return;
    }

    return checkedItem;
  },

  /**
  * Finds all models in modelType with key === val.
  * `key` is optional; searches `id` key by default if given two arguments.
  * `val` is optional; returns all models if not given.
  *
  * @param {String} type The name of the modelType you wish to search through.
  * @param {String} [key=id] Optional key to search modelType. Defaults to `id` if not given.
  * @param {(Number|String|Date)} val Optional value you're looking for in `key`.
  * @returns {Array} Returns an array with any objects that matched.
  */
  all: function (type, key, val) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    if (typeof val === 'undefined') {
      if (typeof key === 'undefined') {
        return modelType;
      } else if (typeof key === 'number' || !isNaN(parseInt(key, 10))) {
        // we're searching by id, leverage the fact that it's already sorted
        return [this._binarySearch(type, parseInt(key, 10))];
      }

      // no idea what we're trying to search, but it's not an number id
      return [];
    }

    return modelType.filterBy(key, val);
  },

  /**
  * Finds the first model in modelType with key === val.
  * `key` is optional; searches `id` key by default if given two arguments.
  *
  * @param {String} type The name of the modelType you wish to search through.
  * @param {String} [key=id] Optional key to search modelType. Defaults to `id` if not given.
  * @param {(Number|String|Date)} val The value you're looking for in `key`.
  * @returns {(Object|undefined)} Returns the object or undefined if it wasn't found.
  */
  find: function (type, key, val) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    // we're searching by id, leverage the fact that it's already sorted
    if (typeof val === 'undefined' && !isNaN(parseInt(key, 10))) {
      return this._binarySearch(modelType, parseInt(key, 10));
    }

    return modelType.findBy(key, val);
  },
});

export default DataStore;

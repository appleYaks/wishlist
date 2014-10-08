var DataStore = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('_store', Ember.Object.create());
    this.set('_factories', Ember.Object.create());
  },

  /**
  * Empty out all data records from each internal model store. All models (but not their factories) are lost.
  * @return
  */
  clear: function () {
    for (var type in this._store) {
      if (this._store.hasOwnProperty(type) && typeof this._store[type] === 'object') {
        this._store[type].get('model').clear();
      }
    }
  },

  /**
  * Add a storage unit that will contain models of a given named type. It is initialized empty.
  * @param {String} type A string name of the internal array representation of model data of a certain type.
  * @return
  */
  addType: function (type) {
    if (typeof this._store[type] !== 'undefined') {
      throw new Error('A model type of type "' + type + '" already exists! Cannot add it again.');
    }

    // using ArrayController to sort it now makes later binary search easier
    this._store[type] = Ember.ArrayController.create({
      model: Ember.A(),
      sortProperties: ['id'],
      sortAscending: true,
    });
  },

  /**
  * Keeps a reference of the given model factory internally under the given named type. New models with that named type created from JSON or extended from an existing Ember object-type will be created from this factory, or by default, from `Ember.Object.create()`.
  * @param {String} type A string name representing the model type and its factory type.
  * @param {(Function|Object|Ember.Object)} factory An existing function, object, or Ember.Object that will create a new object of its type when its `.create()` method is invoked. `factory.create()` MUST exist.
  * @return
  */
  registerModelFactory: function (type, factory) {
    if (!this._store[type]) {
      throw new Error('There is no model type ' + type + ' in the datastore!');
    }

    if (typeof this._factories.get(type) !== 'undefined') {
      throw new Error ('There is already a registered model factory of type ' + type + ' in the datastore!');
    }

    if (typeof factory !== 'function' || typeof factory.create === 'undefined') {
      throw new Error ('The model factory of type ' + type + 'you are trying to register is not of the proper datatype!');
    }

    this._factories.set(type, factory);
  },

  /**
  * Create a new model using its factory, or if one doesn't exist, `Ember.Object.create()`. Can be extended from a deep clone of another object or `Ember.Object`. The factory's `.create()` method **MUST** exist.
  * @param {String} type A string name representing the model type and its factory type.
  * @param {...(Object|Ember.Object)} model Optional existing objects or Ember.Objects to extend from, using a deep clone.
  * @return {Ember.Object} The new object.
  */
  createModelOfType: function (type) {
    var args = [].slice.call(arguments, 1),
        factory = this._factories.get(type) || Ember.Object,
        model;

    if (this.get('warnings') && factory === Ember.Object) {
      console.log('WARNING: A model was created of type "' + type + '" even though there was no registered model factory associated with it.');
    }

    model = factory.create();
    this._mergeObject.apply(this, [model].concat(args));
    return model;
  },

  /**
  * Load new models into the internal data storage unit of the named model type. New models will be created using a previously-registered factory of that type if it exists. The payload can be an object or an array of objects.
  * @param {String} type A string name representing the model type, and if its factory was registered, its factory type.
  * @param {(Object|Array)} payload An object or array of objects to load into internal model storage.
  * @return
  */
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

    if (!Array.isArray(payload) || (payload.length === 1 && (payload = payload[0]))) {
      foundItem = this._binarySearch(modelType, payload.id);

      if (foundItem) {
        this._mergeObject(foundItem, payload);
      } else {
        modelType.pushObject(this.createModelOfType(type, payload));
      }

      return;
    }

    if (!modelType.get('length')) {
      emberizedItems = payload.map(function (obj) {
        return this.createModelOfType(type, obj);
      }, this);

      this._store[type].pushObjects(emberizedItems);
      return;
    }

    // now we know both payload and the modelType in the store are non-zero-length arrays.
    // we need to check for collisions and update those that exist, and insert those that don't.
    // we also need to be extremely careful not to modify the array while we're searching it.
    payload.forEach(function (item) {
      foundItem = this._binarySearch(modelType, item.id);

      if (foundItem) {
        this._mergeObject(foundItem, item);
      } else {
        emberizedItems.push(this.createModelOfType(type, item));
      }
    }, this);

    modelType.pushObjects(emberizedItems);
  },

  /**
  * Use the containing array to update the properties of an object it contains and notify observers.
  * @param {Object} obj The object you want the following arguments' object properties to be merged into.
  * @param {...(Object|Ember.Object)} model Optional existing objects or Ember.Objects to extend from, using a deep clone.
  * @return
  */
  _mergeObject: function (obj) {
    var args = [].slice.call(arguments, 1);
    var i, prop, curr;

    for (i = 0; i !== args.length; ++i) {
      if (typeof obj !== 'object' || Array.isArray(obj)) {
        continue;
      }

      // easily create a deep clone of an object/Ember.Object.
      curr = JSON.parse(JSON.stringify(args[i]));

      for (prop in curr) {
        if (curr.hasOwnProperty(prop)) {
          obj.set(prop, curr[prop]);
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

    if (typeof value === 'undefined') {
      throw new Error('The value for binary searching was undefined!');
    }

    if (key === 'id' && value < 0) {
      throw new Error('The value for binary searching by id was less than zero!');
    }

    if (!sortedArray.get('length')) {
      return;
    }

    var beg = 0,
        end = sortedArray.get('length') - 1,
        mid,
        checkedItem;

    while (beg <= end) {
      mid = beg + Math.floor((end - beg) / 2);
      checkedItem = sortedArray.objectAt(mid);

      if (checkedItem[key] < value) {
        beg = mid + 1;
      } else if (checkedItem[key] > value) {
        end = mid - 1;
      } else {
        return checkedItem;
      }
    }

    return;
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
        return [this._binarySearch(modelType, parseInt(key, 10))];
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
    if (typeof val === 'undefined') {
      if (isNaN(parseInt(key, 10))) {
        return;
      } else {
        return this._binarySearch(modelType, parseInt(key, 10));
      }
    }

    return modelType.findBy(key, val);
  },

  deleteModels: function (type, models) {
    var modelType = this._store[type];

    if (!modelType) {
      throw new Error('There is no model of type ' + type + ' in the datastore!');
    }

    if (Array.isArray(models)) {
      modelType.removeObjects(models);
    } else if (typeof models === 'object') {
      modelType.removeObject(models);
    }
  },

  seekAndDestroy: function (type, key, val) {
    var models = this.all(type, key, val);
    this.deleteModels(type, models);
  },
});

export default DataStore;

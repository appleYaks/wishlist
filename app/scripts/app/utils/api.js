var api = Ember.Object.extend({
  init: function () {
    this._super();
    // a transform will take the prefixName and prefixVal,
    // and return a set accepted by DataStore#all to filter by key/value
    this.keyTransforms = {
      // noop
      defalt: function (type, prefixName, prefixVal) {
        return [type, prefixName, prefixVal];
      }
    };
  },

  // provide a fake API in the case of a static site with preloaded model data
  fakeIt: function () {
    this.set('find', function (type, id) { return this.store.find(type, id); });
    this.set('fetchAll', function (type, prefixName, prefixVal, transform) {
      var transformed;

      if (typeof prefixVal === 'undefined') {
        return this.store.all(type);
      }

      transform = this.getTransform(transform);
      transformed = transform(type, prefixName, prefixVal);

      return this.store.all.apply(this.store, transformed);
    });
  },

  find: function (type, id) {
    var self = this;

    return $.getJSON('/api/v1/' + type + '/' + id).then(function (payload) {
      self.store.load(type, payload);
      return self.store.find(type, id);
    });
  },

  getTransform: function (transform) {
    if (typeof transform === 'string') {
      transform = this.get('keyTransforms.' + transform);
    } else if (typeof transform === 'undefined') {
      transform = this.get('keyTransforms.defalt');
    } else if (typeof transform !== 'function') {
      throw new Error('Type of keyTransform was not a function!');
    }

    return transform;
  },

  // allows getting all of a nested type,
  // i.e. /api/v1/prefixName/prefixVal/type
  // e.g. /api/v1/groups/1/items
  //
  // the transform will take the prefixName and prefixVal,
  // and return a set accepted by DataStore#all to filter by key/value
  fetchAll: function (type, prefixName, prefixVal, transform) {
    var self = this;

    transform = this.getTransform(transform);

    if (typeof prefixVal === 'undefined') {
      return $.getJSON('/api/v1/' + type).then(function (payload) {
        self.store.load(type, payload);
        return self.store.all(type);
      });
    }

    if (typeof prefixName !== 'string' || prefixName === '') {
      throw new Error('Tried to search for all of a type, but got no prefix!');
    }

    return $.getJSON('/api/v1/' + prefixName + '/' + prefixVal + '/' + type).then(function (payload) {
      var transformed = transform(type, prefixName, prefixVal);
      self.store.load(type, payload);
      return self.store.all.apply(self.store, transformed);
    });
  }
});

export default api;

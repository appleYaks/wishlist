var apiFetch = Ember.Object.extend({
  init: function () {
    this._super();
    this.keyTransforms = {
      // noop
      defalt: function (type, prefixName, prefixVal) { return [type, prefixName, prefixVal];
    }};
  },

  find: function (type, id) {
    var self = this,
        model;

    if (model = this.store.findById(type, id)) {
      return model;
    }

    return $.getJSON('/api/v1/' + type + '/' + id).then(function (payload) {
      self.store.load(type, payload);
      return self.store.findById(type, id);
    });
  },

  findAll: function (type, prefixName, prefixVal, transform) {
    var self = this;

    transform = transform || this.get('keyTransforms.defalt');

    if (typeof transform !== 'function') {
      throw new Error('Type of keyTransform was not a function!');
    }

    if (!prefixVal) {
      return $.getJSON('/api/v1/' + type).then(function (payload) {
        self.store.load(type, payload);
        return self.store.all(type);
      });
    }

    if (!prefixName) {
      throw new Error('Tried to search for all of a type, but got no postfix!');
    }

    return $.getJSON('/api/v1/' + prefixName + '/' + prefixVal + '/' + type).then(function (payload) {
      var transformed = transform(type, prefixName, prefixVal);
      self.store.load(type, payload);
      return self.store.all.apply(self.store, transformed);
    });
  }
});

export default apiFetch;

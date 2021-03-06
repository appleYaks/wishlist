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
    var self = this;

    this.set('add', function (type, model) {
      var count = self.store.all(type).get('length');
      // model will be destroyed on willTransition, so we need a copy to add to the store
      model = JSON.parse(JSON.stringify(model));
      // make sure the new id is past any probable id number in the preloaded data
      model.id = 100 + count;
      return Ember.RSVP.resolve(model);
    });
    this.set('edit', function (type, model) {
      // app code expects plain object (from server), so "create" one
      model = JSON.parse(JSON.stringify(model));
      return Ember.RSVP.resolve(model);
    });
    this.set('patch', function (type, model) {
      // app code expects plain object (from server), so "create" one
      model = JSON.parse(JSON.stringify(model));
      return Ember.RSVP.resolve(model);
    });
    this.set('deleteModel', function () { return Ember.RSVP.resolve(); });
    this.set('find', function (type, id) { return self.store.find(type, id); });
    this.set('fetchAll', function (type, prefixName, prefixVal, transform) {
      var transformed;

      if (typeof prefixVal === 'undefined') {
        return self.store.all(type);
      }

      transform = self.getTransform(transform);
      transformed = transform(type, prefixName, prefixVal);

      return self.store.all.apply(self.store, transformed);
    });
  },

  add: function (type, model) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      model = JSON.stringify(model);

      $.ajax({
        url: '/api/v1/' + type,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: model,
      }).done(function (data) {
        resolve(data);
      }).fail(reject);
    });
  },

  edit: function (type, model) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var id = Ember.get(model, 'id');

      model = JSON.stringify(model);

      $.ajax({
        url: '/api/v1/' + type + '/' + id,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: model,
      }).done(function (data) {
        resolve(data);
      }).fail(reject);
    });
  },

  patch: function (type, model, patchKeys) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var id = Ember.get(model, 'id'),
          patches = JSON.stringify(model.getProperties(patchKeys));

      if (typeof id === 'undefined') {
        return reject(new Error('model did not have an id!'));
      }

      $.ajax({
        url: '/api/v1/' + type + '/' + id,
        type: 'PATCH',
        contentType: 'application/json',
        dataType: 'json',
        data: patches,
      }).done(resolve).fail(reject);
    });
  },

  deleteModel: function (type, model) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var id = Ember.get(model, 'id');

      if (typeof id === 'undefined') {
        return reject(new Error('model did not have an id!'));
      }

      $.ajax({
        url: '/api/v1/' + type + '/' + id,
        type: 'DELETE',
      }).done(resolve).fail(reject);
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
    }

    if (typeof transform === 'undefined') {
      transform = this.get('keyTransforms.defalt');
    }

    if (typeof transform !== 'function') {
      throw new Error('Type of keyTransform was not a function!');
    }

    return transform;
  },

  // allows getting all of a nested type,
  // i.e. /api/v1/prefixName/prefixVal/type
  // e.g. /api/v1/groups/1/items
  //
  // the transform will take the prefixName and prefixVal,
  // and return an array of parameters for DataStore#all
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

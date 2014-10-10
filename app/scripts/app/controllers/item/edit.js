var ItemEditController = Em.ObjectController.extend({
  complete: function (key, value) {
    if (arguments.length > 1) {
      return value;
    }

    return this.get('canonicalModel.complete');
  }.property('canonicalModel.complete'),

  actions: {
    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('items');
    },

    save: function () {
      var self = this,
          item = this.get('model');

      this.api.edit('items', item).then(function (data) {
        var id = Ember.get(data, 'id');

        self.store.load('items', data);
        self.send('refresh');

        self.transitionToRoute('item.index', self.store.find('items', id));
      }).catch(function () {
        alert('Sorry, something went wrong saving your edited item! Please try again later.');
      });
    },
  }
});

export default ItemEditController;

var ItemEditController = Em.ObjectController.extend({
  setComplete: function () {
    var complete = this.get('canonicalModel.complete');
    this.set('model.complete', complete);
  }.observes('canonicalModel.complete'),

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

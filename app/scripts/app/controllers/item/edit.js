var ItemEditController = Em.ObjectController.extend({
  setComplete: function () {
    var model = this.get('model'),
        complete;

    // this observer fires even when this controller is not part of the active route.
    // this is because route controllers are singletons and persist.
    // since changing routes destroys the temp model we used for editing, we must
    // avoid accessing or mutating it until we know it's fresh (on entering the route).
    if (model.isDestroyed) {
      return;
    }

    complete = this.get('canonicalModel.complete');
    model.set('complete', complete);
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

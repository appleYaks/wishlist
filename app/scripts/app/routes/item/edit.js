var ItemEditRoute = Em.Route.extend({
  setupController: function (controller, item) {
    // deep copy of passed-in model to mess with in case edits are canceled.
    // seems like `.toJSON()` is not supported for `Ember.Object`
    controller.set('model', this.store.createModelOfType('items', item));
    controller.set('canonicalModel', item);
  },

  renderTemplate: function () {
    this.render('item/edit', {
      into: 'application',
      outlet: 'item',
    });
  },

  actions: {
    willTransition: function () {
      this.get('controller.model').destroy();
    }
  }
});

export default ItemEditRoute;

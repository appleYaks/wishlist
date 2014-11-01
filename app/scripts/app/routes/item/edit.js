import ItemViewRouteMixin from 'client/mixins/item-view-route';

var ItemEditRoute = Em.Route.extend(ItemViewRouteMixin, {
  setupController: function (controller, item) {
    controller.set('canonicalModel', item);

    // deep copy of passed-in model to mess with in case edits are canceled.
    // seems like `.toJSON()` is not supported for `Ember.Object`
    item = this.store.createModelOfType('items', item);
    this._super(controller, item);
  },

  renderTemplate: function () {
    this.render('item/edit', {
      into: 'application',
      outlet: 'item',
    });
  },

  actions: {
    willTransition: function (transition) {
      var controller = this.get('controller'),
          model = controller.get('model');

      model.destroy();
      this._super(transition);
    }
  }
});

export default ItemEditRoute;

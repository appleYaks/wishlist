var ItemNewRoute = Em.Route.extend({
  setupController: function (controller) {
    controller.set('model', this.store.createModelOfType('items'));
  },

  renderTemplate: function () {
    this.render('items/new', {
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

export default ItemNewRoute;

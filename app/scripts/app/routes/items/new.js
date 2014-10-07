var ItemNewRoute = Em.Route.extend({
  setupController: function (controller) {
    var model = this.store.createModelOfType('items', {
      GroupId: this.controllerFor('items').get('GroupId')
    });

    controller.set('model', model);
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

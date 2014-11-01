import ItemViewRouteMixin from 'client/mixins/item-view-route';

var ItemsNewRoute = Em.Route.extend(ItemViewRouteMixin, {
  setupController: function (controller) {
    var model = this.store.createModelOfType('items', {
      GroupId: this.controllerFor('items').get('GroupId')
    });

    this._super(controller, model);
  },

  renderTemplate: function () {
    this.render('items/new', {
      into: 'application',
      outlet: 'item',
    });
  },

  actions: {
    willTransition: function (transition) {
      var controller = this.get('controller'),
          model = controller.get('model');

      model.destroy();

      // allow ItemsRoute model to show the new model
      this.send('refresh');

      this._super(transition);
    }
  }
});

export default ItemsNewRoute;

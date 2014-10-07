var ItemsRoute = Em.Route.extend({
  model: function (params) {
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  setupController: function (controller, model) {
    // allow sub-routes to access the GroupId since it seems the dynamic segment is not available otherwise
    controller.set('GroupId', model.get('firstObject.GroupId'));
    this._super(controller, model);
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

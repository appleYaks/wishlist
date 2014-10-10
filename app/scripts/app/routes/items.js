var ItemsRoute = Em.Route.extend({
  model: function (params) {
    this.set('currentGroupId', parseInt(params.group_id, 10));
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  setupController: function (controller, model) {
    // allow sub-routes to access the GroupId since it seems the dynamic segment is not available otherwise
    controller.set('GroupId', this.get('currentGroupId'));
    this._super(controller, model);
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  },

  actions: {
    refresh: function () {
      this.refresh();
      return true;
    }
  }
});

export default ItemsRoute;

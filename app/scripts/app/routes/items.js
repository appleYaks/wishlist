var ItemsRoute = Em.Route.extend({
  model: function (params) {
    return this.api.findAll('items', 'groups', params.group_id);
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

var ItemsRoute = Em.Route.extend({
  model: function (params) {
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

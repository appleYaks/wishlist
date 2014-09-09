var ItemsRoute = Em.Route.extend({
  model: function (params) {
    return $.getJSON('/api/v1/groups/' + params.group_id + '/items');
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

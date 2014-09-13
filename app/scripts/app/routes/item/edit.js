var ItemEditRoute = Em.Route.extend({
  model: function (params) {
    return this.api.find('items', params.item_id);
  },

  renderTemplate: function () {
    this.render('item.edit', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemEditRoute;

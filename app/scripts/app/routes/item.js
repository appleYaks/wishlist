var ItemRoute = Em.Route.extend({
  model: function (params) {
    return this.api.find('items', params.item_id);
  },

  renderTemplate: function () {
    this.render('item', {
      into: 'application',
      outlet: 'item',
    });
  },
});

export default ItemRoute;

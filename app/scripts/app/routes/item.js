var ItemRoute = Em.Route.extend({
  model: function (params) {
    return $.getJSON('/api/v1/items/' + params.item_id);
  },

  renderTemplate: function () {
    this.render('item', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemRoute;

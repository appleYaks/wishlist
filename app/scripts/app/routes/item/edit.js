var ItemEditRoute = Em.Route.extend({
  renderTemplate: function () {
    this.render('item/edit', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemEditRoute;

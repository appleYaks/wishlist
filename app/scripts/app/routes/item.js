var ItemRoute = Em.Route.extend({
  renderTemplate: function () {
    this.render('item', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemRoute;

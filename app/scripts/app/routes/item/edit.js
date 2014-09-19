var ItemEditRoute = Em.Route.extend({
  renderTemplate: function () {
    this.render('item/edit', {
      into: 'application',
      outlet: 'itemEdit',
    });
  }
});

export default ItemEditRoute;

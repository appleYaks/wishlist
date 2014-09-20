var ItemIndexRoute = Em.Route.extend({
  renderTemplate: function () {
    this.render('item/index', {
      into: 'application',
      outlet: 'item',
    });
  },
});

export default ItemIndexRoute;

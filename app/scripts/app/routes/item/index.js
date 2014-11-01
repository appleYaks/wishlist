import ItemViewRouteMixin from 'client/mixins/item-view-route';

var ItemIndexRoute = Em.Route.extend(ItemViewRouteMixin, {
  renderTemplate: function () {
    this.render('item/index', {
      into: 'application',
      outlet: 'item',
    });
  },
});

export default ItemIndexRoute;

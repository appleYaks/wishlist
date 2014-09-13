import apiFetch from 'client/utils/api-fetch';

var ItemRoute = Em.Route.extend({
  model: function (params) {
    return apiFetch('items/' + params.item_id);
  },

  renderTemplate: function () {
    this.render('item', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemRoute;

import apiFetch from 'client/utils/api-fetch';

var ItemsRoute = Em.Route.extend({
  model: function (params) {
    return apiFetch('groups/' + params.group_id + '/items');
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

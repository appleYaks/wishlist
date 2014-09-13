import apiFetch from 'client/utils/api-fetch';

var GroupsRoute = Em.Route.extend({
  model: function () {
    var preload = this.get('preload');

    if (preload) {
      this.set('preload', null);
      return preload;
    }

    return apiFetch('groups');
  },

  renderTemplate: function () {
    this.render('groups', {
      into: 'application',
      outlet: 'groups',
    });
  }
});

export default GroupsRoute;

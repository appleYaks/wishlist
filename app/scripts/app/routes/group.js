import apiFetch from 'client/utils/api-fetch';

var GroupRoute = Ember.Route.extend({
  model: function (params) {
    return apiFetch('groups/' + params.group_id);
  },

  renderTemplate: function () {
    this.render('group', {
      into: 'application',
      outlet: 'group'
    });
  },
});

export default GroupRoute;

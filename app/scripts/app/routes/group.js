var GroupRoute = Ember.Route.extend({
  model: function (params) {
    return $.getJSON('/api/v1/groups/' + params.group_id);
  },

  renderTemplate: function () {
    this.render('group', {
      into: 'application',
      outlet: 'group'
    });
  },
});

export default GroupRoute;

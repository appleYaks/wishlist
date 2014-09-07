var GroupRoute = Ember.Route.extend({
  model: function (params) {
    return this.store.find('group', params.group_id);
  },

  renderTemplate: function () {
    this.render('group', {
      into: 'application',
      outlet: 'group'
    });
  },
});

export default GroupRoute;

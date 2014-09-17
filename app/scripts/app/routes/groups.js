var GroupsRoute = Em.Route.extend({
  model: function () {
    var preload = this.get('preload');

    if (preload) {
      this.set('preload', null);
      return this.store.all('groups');
    }

    return this.api.fetchAll('groups');
  },

  renderTemplate: function () {
    this.render('groups', {
      into: 'application',
      outlet: 'groups',
    });
  }
});

export default GroupsRoute;

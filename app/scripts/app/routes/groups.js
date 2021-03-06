import SortableRouteMixin from 'client/mixins/sortable-route';

var GroupsRoute = Em.Route.extend(SortableRouteMixin, {
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
  },

  actions: {
    refresh: function () {
      this.refresh();
    }
  }
});

export default GroupsRoute;

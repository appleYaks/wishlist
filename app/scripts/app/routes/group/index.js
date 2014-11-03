import GroupViewRouteMixin from 'client/mixins/group-view-route';

var GroupIndexRoute = Em.Route.extend(GroupViewRouteMixin, {
  renderTemplate: function () {
    this.render('group/index', {
      into: 'application',
      outlet: 'group',
    });
  },
});

export default GroupIndexRoute;

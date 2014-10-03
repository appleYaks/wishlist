var GroupIndexRoute = Em.Route.extend({
  renderTemplate: function () {
    this.render('group/index', {
      into: 'application',
      outlet: 'group',
    });
  },
});

export default GroupIndexRoute;

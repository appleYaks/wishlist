var GroupsNewRoute = Em.Route.extend({
  setupController: function (controller) {
    controller.set('model', this.store.createModelOfType('groups'));
  },

  renderTemplate: function () {
    this.render('groups/new', {
      into: 'application',
      outlet: 'group',
    });
  },

  actions: {
    willTransition: function () {
      this.get('controller.model').destroy();
    }
  }
});

export default GroupsNewRoute;

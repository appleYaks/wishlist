var GroupEditRoute = Em.Route.extend({
  setupController: function (controller, group) {
    // deep copy of passed-in model to mess with in case edits are canceled.
    // seems like `.toJSON()` is not supported for `Ember.Object`
    controller.set('model', this.store.createModelOfType('groups', group));
    controller.set('canonicalModel', group);
  },

  renderTemplate: function () {
    this.render('group/edit', {
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

export default GroupEditRoute;

import GroupViewRouteMixin from 'client/mixins/group-view-route';

var GroupEditRoute = Em.Route.extend(GroupViewRouteMixin, {
  setupController: function (controller, group) {
    controller.set('canonicalModel', group);

    // deep copy of passed-in model to mess with in case edits are canceled.
    // seems like `.toJSON()` is not supported for `Ember.Object`
    group = this.store.createModelOfType('groups', group);
    this._super(controller, group);
  },

  renderTemplate: function () {
    this.render('group/edit', {
      into: 'application',
      outlet: 'group',
    });
  },

  actions: {
    willTransition: function (transition) {
      var controller = this.get('controller'),
          model = controller.get('model');

      model.destroy();
      this._super(transition);
    }
  }
});

export default GroupEditRoute;

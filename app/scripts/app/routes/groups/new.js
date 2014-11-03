import GroupViewRouteMixin from 'client/mixins/group-view-route';

var GroupsNewRoute = Em.Route.extend(GroupViewRouteMixin, {
  setupController: function (controller) {
    var model = this.store.createModelOfType('groups');
    this._super(controller, model);
  },

  renderTemplate: function () {
    this.render('groups/new', {
      into: 'application',
      outlet: 'group',
    });
  },

  actions: {
    willTransition: function (transition) {
      var controller = this.get('controller'),
          model = controller.get('model');

      model.destroy();

      // allow GroupsRoute model to show the new model
      this.send('refresh');

      this._super(transition);
    }
  }
});

export default GroupsNewRoute;

import transitionEndName from 'client/utils/get-transitionend-event-name';

var ItemsRoute = Em.Route.extend({
  model: function (params) {
    this.set('currentGroupId', parseInt(params.group_id, 10));
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  setupController: function (controller, model) {
    var self = this;

    // allow sub-routes to access the GroupId since it seems the dynamic segment is not available otherwise
    controller.set('GroupId', this.get('currentGroupId'));

    // requestAnimationFrame seems to be the only way for iOS
    // to respect the CSS transition delay when navigating to a deeper URL
    window.requestAnimationFrame(function () {
      Ember.run.scheduleOnce('afterRender', self, 'setControllerActive');
    });

    this._super(controller, model);
  },

  setControllerActive: function () {
    this.set('controller.active', true);
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  },

  actions: {
    refresh: function () {
      this.refresh();
      return true;
    },

    willTransition: function (transition) {
      var controller = this.get('controller'),
          element = $('.items');

      if (transition.params['item.index']) {
        this.controllerFor('item.index').set('active', false);
      }

      if (transition.params['item.edit']) {
        this.controllerFor('item.edit').set('active', false);
      }

      if (element.length && controller.get('active') === true && transition.params['groups.index']) {
        controller.set('active', false);

        transition.abort();

        element.one(transitionEndName, function () {
          Ember.run(function () { transition.retry(); });
        });
      }
    }
  }
});

export default ItemsRoute;

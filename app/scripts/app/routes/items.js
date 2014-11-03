import ActiveRouteBaseMixin from 'client/mixins/active-route-base';
import transitionEndName from 'client/utils/get-transitionend-event-name';

var ItemsRoute = Em.Route.extend(ActiveRouteBaseMixin, {
  model: function (params) {
    this.set('currentGroupId', parseInt(params.group_id, 10));
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  setupController: function (controller, model) {
    controller.set('GroupId', this.get('currentGroupId'));
    this._super(controller, model);
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

      // if transitioning to groups, we need to set `active` to
      // `false` on the ItemsController to make it animate away
      if (element.length && controller.get('active') === true && transition.params['groups.index']) {
        controller.set('active', false);

        transition.abort();

        element.one(transitionEndName, { transition: transition }, this.get('retryTransition'));
      }
    }
  }
});

export default ItemsRoute;

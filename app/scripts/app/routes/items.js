import ActiveRouteBaseMixin from 'client/mixins/active-route-base';
import SortableRouteMixin from 'client/mixins/sortable-route';
import transitionEndName from 'client/utils/get-transitionend-event-name';
import media from 'client/utils/detect-form-factor';

var ItemsRoute = Em.Route.extend(ActiveRouteBaseMixin, SortableRouteMixin, {
  model: function (params) {
    this.set('currentGroupId', parseInt(params.group_id, 10));
    return this.api.fetchAll('items', 'groups', params.group_id);
  },

  setupController: function (controller, model) {
    controller.set('GroupId', this.get('currentGroupId'));
    this.clearSortingMethod();
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
      // tablet sizes and bigger have a multi-panel layout and don't need animations here
      if (media.notSmall()) {
        return;
      }

      var controller = this.get('controller'),
          element = $('.items');

      // if transitioning to groups, we need to set `active` to
      // `false` on the ItemsController to make it animate away
      if (element.length && controller.get('active') === true && transition.params['groups.index']) {
        controller.set('active', false);

        transition.abort();

        // this line must go before retrying the transition, since the
        // event bubble hierarchy will be different once the route exits.
        element.one(transitionEndName, { controller: controller }, this.get('clearSortingMethod'));

        element.one(transitionEndName, { transition: transition }, this.get('retryTransition'));
      }
    }
  }
});

export default ItemsRoute;

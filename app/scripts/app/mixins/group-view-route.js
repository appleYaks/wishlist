import ActiveRouteBaseMixin from 'client/mixins/active-route-base';
import transitionEndName from 'client/utils/get-transitionend-event-name';

var GroupViewRouteMixin = Ember.Mixin.create(ActiveRouteBaseMixin, {
  actions: {
    willTransition: function (transition) {
      // group view will always be the second section element
      var element = $('.content > section:nth-of-type(2)');

      // prevent infinite loop on transition.retry()
      if (!element.length || !element.hasClass('active')) {
        return;
      }

      // transitioning between the new,index,and edit routes should be instantaneous
      if (transition.params['group.index']) {
        this.controllerFor('group.index').set('active', true);
        return;
      }
      if (transition.params['group.edit']) {
        this.controllerFor('group.edit').set('active', true);
        return;
      }

      // TODO: skip transition abort + CSS transition if not on mobile
      transition.abort();
      this.setControllerInactive();

      element.one(transitionEndName, { transition: transition }, this.get('retryTransition'));
    }
  }
});

export default GroupViewRouteMixin;

import transitionEndName from 'client/utils/get-transitionend-event-name';
import ViewRouteBaseMixin from 'client/mixins/view-route-base';

var ItemViewRouteMixin = Ember.Mixin.create(ViewRouteBaseMixin, {
  actions: {
    willTransition: function (transition) {
      // item view will always be the third section element
      var element = $('.content > section:nth-of-type(3)');

      // prevent infinite loop on transition.retry()
      if (!element.length || !element.hasClass('active')) {
        return;
      }

      // transitioning between the new,index,and edit routes should be instantaneous
      if (transition.params['item.index']) {
        this.controllerFor('item.index').set('active', true);
        return;
      }
      if (transition.params['item.edit']) {
        this.controllerFor('item.edit').set('active', true);
        return;
      }

      // TODO: skip transition abort + CSS transition if not on mobile
      transition.abort();
      this.setControllerInactive();

      element.one(transitionEndName, { transition: transition }, this.get('retryTransition'));
    }
  }
});

export default ItemViewRouteMixin;

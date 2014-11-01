import transitionEndName from 'client/utils/get-transitionend-event-name';

function retryTransition (evt) {
  var transition = evt.data.transition;

  Ember.run(function () {
    transition.retry();
  });
}

var ItemViewRoute = Ember.Mixin.create({
  setupController: function (controller, model) {
    this.setControllerActive();
    this._super(controller, model);
  },

  // afterModel: function () {
  //   this.setControllerActive();
  // },

  setControllerActive: function () {
    var self = this;
    // requestAnimationFrame seems to be the only way for iOS to respect the CSS transition delay
    window.requestAnimationFrame(function () {
      self.set('controller.active', true);
    });
  },

  setControllerInactive: function () {
    var self = this;
    // requestAnimationFrame seems to be the only way for iOS to respect the CSS transition delay
    window.requestAnimationFrame(function () {
      self.set('controller.active', false);
    });
  },

  actions: {
    willTransition: function (transition) {
      var element = $('.content > section:nth-of-type(3)');

      // prevent infinite loop on transition.retry()
      if (!element.length || !element.hasClass('active')) {
        return;
      }

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

      element.one(transitionEndName, { transition: transition }, retryTransition);
    }
  }
});

export default ItemViewRoute;

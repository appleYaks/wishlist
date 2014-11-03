var ActiveRouteBaseMixin = Ember.Mixin.create({
  setupController: function (controller, model) {
    this.setControllerActive();
    this._super(controller, model);
  },

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

  retryTransition: function (evt) {
    var transition = evt.data.transition;

    Ember.run(function () {
      transition.retry();
    });
  },
});

export default ActiveRouteBaseMixin;

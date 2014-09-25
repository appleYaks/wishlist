var FastClickInit = function () {
  Ember.$(function () {
    Ember.run.scheduleOnce('afterRender', function () {
      FastClick.attach(document.body);
    });
  });
};

export default FastClickInit;

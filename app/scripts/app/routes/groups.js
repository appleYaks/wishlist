var GroupsRoute = Em.Route.extend({
  actions: {
    willTransition: function (transition) {
      // console.log('yo son')
      // transition.abort();
      // var promise = Ember.RSVP.Promise(function (resolve) {
      //   setTimeout(function () {
      //     transition.retry();
      //     resolve();
      //   }, 3000);
      // });
      // return promise;
    },

  },

  model: function () {
    var preload = this.get('preload');

    if (preload) {
      this.set('preload', null);
      return this.store.all('group');
    }

    return this.store.find('group');
  },

  renderTemplate: function () {
    this.render('groups', {
      into: 'application',
      outlet: 'groups',
    });
  }
});

export default GroupsRoute;

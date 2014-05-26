var GroupRoute = Ember.Route.extend({
  // beforeModel: function () {
  //   console.log('moving into group route')
  // },

  // afterModel: function (model, transition) {
  //   console.log('transition aborted?', transition.isAborted, transition)
  //   // transition.abort();
  //   // // this.transitionTo('groups')
  //   // console.log('transition aborted now?', transition.isAborted, transition)
  //   // return
  //   return Ember.RSVP.Promise(function (resolve) {
  //     Ember.run.later(function() { resolve(model); }, 1000);
  //   });
  // },

  model: function (params) {
    return this.store.find('group', params.group_id);
  },

  renderTemplate: function () {
    this.render('group', {
      into: 'application',
      outlet: 'group'
    });
  },
});

export default GroupRoute;

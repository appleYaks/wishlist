var GroupsNewController = Em.ObjectController.extend({
  actions: {
    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('groups');
    },

    save: function () {
      // call api on the server to save group.
      // when request returns, store.load() the result.
      // call .refresh() on the route via an action, (necessary?)
      // then transitionTo groups
      // the willTransition on this route will destroy this temp model
    },
  }
});

export default GroupsNewController;

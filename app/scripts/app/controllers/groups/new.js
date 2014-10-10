var GroupsNewController = Em.ObjectController.extend({
  actions: {
    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('groups');
    },

    save: function () {
      var self = this,
          group = this.get('model');

      this.api.add('groups', group).then(function (data) {
        self.store.load('groups', data);
        self.send('refresh');

        self.transitionToRoute('groups');
      }).catch(function () {
        alert('Sorry, saving your group failed! Please try again later.');
      });
    },
  }
});

export default GroupsNewController;

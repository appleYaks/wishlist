var GroupEditController = Em.ObjectController.extend({
  actions: {
    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('groups');
    },

    save: function () {
      var self = this,
          group = this.get('model');

      this.api.edit('groups', group).then(function (data) {
        var id = Ember.get(data, 'id');

        self.store.load('groups', data);
        self.send('refresh');

        self.transitionToRoute('group.index', id);
      }).catch(function () {
        alert('Sorry, something went wrong saving your edited group! Please try again later.');
      });
    },
  }
});

export default GroupEditController;

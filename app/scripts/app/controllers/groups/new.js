import validateGroup from 'client/validators/group';

var GroupsNewController = Em.ObjectController.extend({
  validationErrors: null,

  actions: {
    cancel: function () {
      this.transitionToRoute('groups');
    },

    save: function () {
      var self = this,
          // needed because Ember.TextField does not convert input to numbers
          group = this.get('model').numberize(),
          validationErrors = validateGroup(group);

      this.set('validationErrors', validationErrors);

      if (validationErrors.length) {
        return;
      }

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

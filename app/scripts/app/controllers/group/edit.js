import ActivatableControllerMixin from 'client/mixins/activatable-controller';
import validateGroup from 'client/validators/group';

var GroupEditController = Em.ObjectController.extend(ActivatableControllerMixin, {
  // set by the route; `model` is a temp copy of `canonicalModel`
  canonicalModel: null,

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

      this.api.edit('groups', group).then(function (data) {
        var id = Ember.get(data, 'id');

        self.store.load('groups', data);

        self.transitionToRoute('group.index', self.store.find('groups', id));
      }).catch(function () {
        alert('Sorry, something went wrong saving your edited group! Please try again later.');
      });
    },
  }
});

export default GroupEditController;

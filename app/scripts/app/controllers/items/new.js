import ActivatableControllerMixin from 'client/mixins/activatable-controller';
import validateItem from 'client/validators/item';

var ItemsNewController = Em.ObjectController.extend(ActivatableControllerMixin, {
  needs: ['items'],

  // the route sets GroupId
  GroupId: null,

  validationErrors: null,

  actions: {
    cancel: function () {
      this.transitionToRoute('items');
    },

    save: function () {
      var self = this,
          // needed because Ember.TextField does not convert input to numbers
          item = this.get('model').numberize(),
          GroupId = this.get('controllers.items.GroupId'),
          validationErrors = validateItem(item);

      this.set('validationErrors', validationErrors);

      if (validationErrors.length) {
        return;
      }

      item.set('GroupId', GroupId);

      this.api.add('items', item).then(function (data) {
        self.store.load('items', data);
        // allow ItemsRoute model to show the new item
        self.send('refresh');

        self.transitionToRoute('items');
      }).catch(function () {
        alert('Sorry, saving your item failed! Please try again later.');
      });
    },
  }
});

export default ItemsNewController;

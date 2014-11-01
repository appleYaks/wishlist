import validateItem from 'client/validators/item';

var ItemsNewController = Em.ObjectController.extend({
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
        var id = Ember.get(data, 'id');

        self.store.load('items', data);
        self.send('refresh');

        self.transitionToRoute('item.index', id);
      }).catch(function () {
        alert('Sorry, saving your item failed! Please try again later.');
      });
    },
  }
});

export default ItemsNewController;

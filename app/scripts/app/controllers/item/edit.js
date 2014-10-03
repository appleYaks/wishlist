import ItemEditControllerMixin from 'client/mixins/item-edit-controller';

var ItemEditController = Em.ObjectController.extend(ItemEditControllerMixin, {
  complete: function (key, value) {
    if (arguments.length > 1) {
      return value;
    }

    return this.get('canonicalModel.complete');
  }.property('canonicalModel.complete'),

  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // call route.refresh(), which should tell `controllers.items` to slice out this model from its content
    },

    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('items');
    },

    save: function () {

    },
  }
});

export default ItemEditController;

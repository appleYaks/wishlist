import ItemEditControllerMixin from 'client/mixins/item-edit-controller';

var ItemNewController = Em.ObjectController.extend(ItemEditControllerMixin, {
  // complete: function (key, value) {
  //   if (arguments.length > 1) {
  //     return value;
  //   }
  // },

  actions: {
    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('items');
    },

    save: function () {
      // call api on the server to save item.
      // when request returns, store.load() the result.
      // call .refresh() on the route via an action, (necessary?)
      // then transitionTo the id returned from the server.
      // the willTransition on this route will destroy this temp model
    },
  }
});

export default ItemNewController;

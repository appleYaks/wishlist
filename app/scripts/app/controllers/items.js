var ItemsController = Em.ArrayController.extend({
  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
    },
  }
});

export default ItemsController;

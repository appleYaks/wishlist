var ItemsController = Em.ArrayController.extend({
  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // tell `controllers.items` to slice out this model from its content
      // this.get('controllers.items');
    },
  }
});

export default ItemsController;

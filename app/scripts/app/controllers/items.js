var ItemsController = Em.ArrayController.extend({
  actions: {
    delete: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // tell `controllers.items` to slice out this model from its content
      // this.get('controllers.items');
    },

    edit: function (item) {
      this.transitionToRoute('item.edit', item);
    }
  }
});

export default ItemsController;

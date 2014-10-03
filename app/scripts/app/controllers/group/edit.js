var GroupEditController = Em.ObjectController.extend({
  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // call route.refresh(), which should tell `controllers.items` to slice out this model from its content
    },

    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('groups');
    },

    save: function () {

    },
  }
});

export default GroupEditController;

var ItemsController = Em.ObjectController.extend({
  actions: {
    doit: function (group) {
      console.log('doing it', group);
      window.z = group;
      group.get('items');
    },
  }
});

export default ItemsController;

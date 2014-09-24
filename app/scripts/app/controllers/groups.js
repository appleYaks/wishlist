var GroupsController = Em.ArrayController.extend({
  actions: {
    delete: function (group) {
      console.log('deleting group: ', group);
      // warn user!!!! get confirmation
      // send API DELETE request with model's `id` (should implicitly delete items)
      // tell DataStore to delete all items with `GroupId` === model's `id`
    },

    edit: function (group) {
      this.transitionToRoute('group.edit', group);
    }
  }
});

export default GroupsController;

import SortableControllerMixin from 'client/mixins/sortable-controller';

var GroupsController = Em.ArrayController.extend(SortableControllerMixin, {
  // user-controlled sort order
  sortedTitleAsc: Ember.computed.equal('userSorted', 'title-asc'),

  actions: {
    delete: function (group) {
      console.log('deleting group: ', group);
      // warn user!!!! get confirmation
      // send API DELETE request with model's `id` (should implicitly delete items)
      // tell DataStore to delete all items with `GroupId` === model's `id`
    },

    edit: function (group) {
      this.transitionToRoute('group.edit', group);
    },

    sortByTitle: function () {
      var direction = this.get('userSorted') === 'title-asc' ? false : true;
      this.set('sortProperties', ['title']);
      this.set('sortAscending', direction);
    }
  }
});

export default GroupsController;

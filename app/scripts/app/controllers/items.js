import SortableControllerMixin from 'client/mixins/sortable-controller';

var ItemsController = Em.ArrayController.extend(SortableControllerMixin, {
  // various sort orders
  sortedTitleAsc: Ember.computed.equal('userSorted', 'title-asc'),
  sortedPriorityAsc: Ember.computed.equal('userSorted', 'priority-asc'),
  sortedRatingAsc: Ember.computed.equal('userSorted', 'rating-asc'),

  actions: {
    delete: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // call route.refresh(), which should tell `controllers.items` to slice out this model from its content
    },

    sortByTitle: function () {
      var direction = this.get('userSorted') === 'title-asc' ? false : true;
      this.set('sortProperties', ['title']);
      this.set('sortAscending', direction);
    },

    sortByPriority: function () {
      var direction = this.get('userSorted') === 'priority-asc' ? false : true;
      this.set('sortProperties', ['priority']);
      this.set('sortAscending', direction);
    },

    sortByRating: function () {
      var direction = this.get('userSorted') === 'rating-asc' ? false : true;
      this.set('sortProperties', ['rating']);
      this.set('sortAscending', direction);
    },
  }
});

export default ItemsController;

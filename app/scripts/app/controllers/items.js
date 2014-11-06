import ActivatableControllerMixin from 'client/mixins/activatable-controller';
import SortableControllerMixin from 'client/mixins/sortable-controller';

var ItemsController = Em.ArrayController.extend(ActivatableControllerMixin, SortableControllerMixin, {
  needs: ['application', 'item/index', 'item/edit'],

  // the route sets GroupId
  GroupId: null,

  // various sort orders
  sortedTitleAsc: Ember.computed.equal('userSorted', 'title-asc'),
  sortedPriorityAsc: Ember.computed.equal('userSorted', 'priority-asc'),
  sortedRatingAsc: Ember.computed.equal('userSorted', 'rating-asc'),
  sortedCompleteAsc: Ember.computed.equal('userSorted', 'complete-asc'),

  actions: {
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

    sortByComplete: function () {
      var direction = this.get('userSorted') === 'complete-asc' ? false : true;
      this.set('sortProperties', ['complete']);
      this.set('sortAscending', direction);
    },

    patchChecked: function (model) {
      this.api.patch('items', model, 'complete').catch(function () {
        alert('Sorry, something went wrong saving your checkmark! Please try again later.');
      });
    },

    delete: function (item) {
      var self = this;

      if(!confirm('Are you sure you want to delete ' + Ember.get(item, 'title') + '?')) {
        return;
      }

      this.api.deleteModel('items', item).then(function () {
        var id = Ember.get(item, 'id'),
        routeName = self.get('controllers.application').get('currentRouteName');

        // if we were viewing or editing that item, we need to transition away
        if (routeName.indexOf('item.index') !== -1 && self.get('controllers.item/index').get('model.id') === id) {
          self.transitionToRoute('items');
        } else if (routeName.indexOf('item.edit') !== -1 && self.get('controllers.item/edit').get('model.id') === id) {
          self.transitionToRoute('items');
        }

        self.store.deleteModels('items', item);
        self.get('model').removeObject(item);
        // refresh the `items` route to remove the model from the list.
        // even if we're on a sub-route, the action will bubble up.
        self.send('refresh');
      }).catch(function () {
        alert('Sorry, something went wrong deleting your item! Please try again later.');
      });
    }
  }
});

export default ItemsController;

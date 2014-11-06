var SortableRouteMixin = Ember.Mixin.create({
  actions: {
    clearSort: function () {
      var controller = this.get('controller');
      // the default from the data store is to sort id ascending.
      // if we set both to null, and the previous vals were to sort anything descending,
      // the list will be sorted by id, but in *descending* order.
      controller.set('sortProperties', ['id']);
      controller.set('sortAscending', true);
    },
  }
});

export default SortableRouteMixin;

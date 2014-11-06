var SortControllerMixin = Ember.Mixin.create({
  userSorted: function () {
    var which = this.get('sortProperties.firstObject');

    if (which) {
      which += this.get('sortAscending') ? '-asc' : '-desc';
    }

    return which;
  }.property('sortProperties', 'sortAscending'),

  actions: {
    clearSort: function () {
      // the default from the data store is store ascending by id.
      // if we set both to null, and the previous vals were to sort anything descending,
      // the list will be sorted by id, but in descending order.
      this.set('sortProperties', ['id']);
      this.set('sortAscending', true);
    }
  }
});

export default SortControllerMixin;

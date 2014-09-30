var SortControllerMixin = Ember.Mixin.create({
  userSorted: function () {
    var which = this.get('sortProperties.firstObject');

    if (which) {
      which += this.get('sortAscending') ? '-asc' : '-desc';
    }

    return which;
  }.property('sortProperties', 'sortAscending'),
});

export default SortControllerMixin;

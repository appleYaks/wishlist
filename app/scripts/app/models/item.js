var Item = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('fields', []);
  },

  title: '',
  description: '',
  rating: 0,
  priority: 0,
  complete: false,
});

export default Item;

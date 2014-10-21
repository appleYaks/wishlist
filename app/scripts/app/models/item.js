import numberizeField from 'client/utils/numberize-field';

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

  numberize: function () {
    var rating = parseInt(this.get('rating'), 10),
        priority = parseInt(this.get('priority'), 10),
        fields = this.get('fields');


    if (!isNaN(rating)) {
      this.set('rating', rating);
    }

    if (!isNaN(priority)) {
      this.set('priority', priority);
    }

    if (!Array.isArray(fields)) {
      return this;
    }

    // only re-set the value if it's clear it's a number,
    // otherwise we'll get NaN in the TextField
    fields.forEach(numberizeField);

    return this;
  }
});

export default Item;

import numberizeField from 'client/utils/numberize-field';

var Group = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('fields', []);
  },

  title: '',
  description: '',

  numberize: function () {
    var fields = this.get('fields');

    if (!Array.isArray(fields)) {
      return this;
    }

    // only re-set the value if it's clear it's a number,
    // otherwise we'll get NaN in the TextField
    fields.forEach(numberizeField);

    return this;
  }
});

export default Group;

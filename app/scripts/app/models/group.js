var Group = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('fields', []);
  },

  title: '',
  description: '',
});

export default Group;

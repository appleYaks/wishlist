var Group = Ember.Object.extend({
  init: function () {
    this._super();
    this.set('date', new Date());
    this.set('fields', []);
  },

  title: '',
  description: '',
});

export default Group;

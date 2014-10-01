var FieldEditView = Ember.View.extend({
  init: function () {
    this._super();

    var type = this.get('field.type');

    if (type === 'String') {
      this.set('isString', true);
    } else if (type === 'Number') {
      this.set('isNumber', true);
    } else if (type === 'Boolean') {
      this.set('isBoolean', true);
    } else if (type === 'Date') {
      this.set('isDate', true);
    }
  }
});

export default FieldEditView;

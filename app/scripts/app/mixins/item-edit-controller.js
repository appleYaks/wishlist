var stringType  = { type: 'String', string: true };
var numberType  = { type: 'Number', number: true };
var booleanType = { type: 'Boolean', bool: true };
var dateType    = { type: 'Date', date: true };

var ItemEditControllerMixin = Ember.Mixin.create({
  fieldKeyTypes: [
    stringType,
    numberType,
    booleanType,
    dateType
  ],

  selectedKeyType: null,
  newFieldKey: null,
  newFieldValue: null,

  resetFieldValue: function () {
    this.set('newFieldValue', null);
  }.observes('selectedKeyType'),

  actions: {
    fieldDateChanged: function (date, fieldKey) {
      var fields = this.get('fields'),
          field;

      if (!fieldKey) {
        throw Error('field did not have a key when changing date!');
      }

      field = fields.findBy('key', fieldKey);

      if (!field) {
        throw Error('a field by the name "' + fieldKey + '" did not exist when changing date!');
      }

      Ember.set(field, 'val', date);
    },

    newFieldDateChanged: function (date) {
      this.set('newFieldValue', date);
    },
  }
});

export default ItemEditControllerMixin;

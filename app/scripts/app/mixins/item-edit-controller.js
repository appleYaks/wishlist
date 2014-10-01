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
    newFieldDateChanged: function (date) {
      this.set('newFieldValue', date);
    },
  }
});

export default ItemEditControllerMixin;

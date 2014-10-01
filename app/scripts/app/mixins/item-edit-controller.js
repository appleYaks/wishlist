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
});

export default ItemEditControllerMixin;

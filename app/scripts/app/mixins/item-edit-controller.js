var stringType = { type: 'String', string: true };
var numberType = { type: 'Number', number: true };
var dateType   = { type: 'Date', date: true };

var ItemEditControllerMixin = Ember.Mixin.create({
  fieldKeyTypes: [
    stringType,
    numberType,
    dateType
  ],

  selectedKeyType: null,
});

export default ItemEditControllerMixin;

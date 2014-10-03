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

    addField: function () {
      var key = this.get('newFieldKey'),
          val = this.get('newFieldValue'),
          type = this.get('selectedKeyType'),
          fields = this.get('fields'),
          errors = [];

      // clear out old errors
      this.set('errors', errors);

      // use defaults
      if (val === null || typeof val === 'undefined') {
        if (type.bool) {
          val = document.getElementById('newFieldValue').checked;
        } else if (!type.date) {
          val = document.getElementById('newFieldValue').getAttribute('placeholder');
        }
      }

      if (type.number) {
        val = parseInt(val, 10);
      }

      if (!key) {
        errors.push('Sorry, I can\'t add a field with no name.');
      } else {
        key = key.replace(/\s+/g, '-');
      }

      if (key && fields.findBy('key', key)) {
        errors.push('Sorry, a field already exists with that name. Please try again.');
      }

      if (!/^[a-zA-Z][0-9a-zA-Z-]+$/.test(key)) {
        errors.push('The name given needs to start with a letter, and afterwords be only letters, numbers, or dashes.');
      }

      if (type.number && isNaN(val)) {
        errors.push('What you entered as a number is actually not a number.');
      }

      if (type.bool && val !== true && val !== false) {
        errors.push('I don\'t know how you broke it, but the checkbox needs to be either checked or unchecked!');
      }

      if (type.date && !moment(val).isValid()) {
        errors.push('That does not appear to be a valid date.');
      }

      if (errors.length) {
        return;
      }

      // everything checked out! add to fields array
      fields.addObject({
        key: key,
        val: val,
        type: type.type
      });

      this.set('newFieldKey', null);

      // keep date from becoming corrupted.
      // the user probably wants to start
      // from where they left off anyway.
      if (!type.date) {
        this.set('newFieldValue', null);
      }
    },
  }
});

export default ItemEditControllerMixin;

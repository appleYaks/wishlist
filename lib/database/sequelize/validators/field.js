var validator = require('validator');

function validateField (field) {
  var prop;

  if (typeof field !== 'object') {
    throw new Error('At least one field was not an object.');
  }

  for (prop in field) {
    if (['key', 'val', 'type'].indexOf(prop) === -1) {
      throw new Error('A field had an unsupported property!');
    }

    if (typeof prop === 'object') {
      throw new Error('A field had an object as a property!');
    }
  }

  if (typeof field.key !== 'string') {
    throw new Error('The key for at least one field was not a String.');
  }

  if (!/^[a-zA-Z][0-9a-zA-Z-]*$/.test(field.key)) {
    throw new Error('The name of a field\'s key did not start with a letter, or was not composed of only letters, numbers, or dashes.');
  }

  if (typeof field.type !== 'string') {
    throw new Error('The type for at least one field was not a String.');
  }

  if (['String', 'Number', 'Date', 'Boolean'].indexOf(field.type) === -1) {
    throw new Error('At least one field had an unsupported type: ' + field.type + '.');
  }

  if (field.type === 'Date' && !validator.isDate(field.val)) {
    throw new Error('Custom Field "' + field.key + '" was not a valid Date.');
  } else if (field.type === 'Number' && typeof field.val !== 'number') {
    throw new Error('Custom Field "' + field.key + '" was not a valid Number.');
  } else if (field.type === 'String' && typeof field.val !== 'string') {
    throw new Error('Custom Field "' + field.key + '" was not a String.');
  } else if (field.type === 'Boolean' && typeof field.val !== 'boolean') {
    throw new Error('Custom Field "' + field.key + '" was not a Boolean.');
  }
}

module.exports = validateField;

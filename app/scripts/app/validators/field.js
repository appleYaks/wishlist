function validateField (field) {
  var errors = [];

  if (typeof field !== 'object') {
    errors.push('At least one field was not an object.');
    return errors;
  }

  if (typeof field.key !== 'string') {
    errors.push('The key for at least one field was not a String.');
  }

  if (typeof field.type !== 'string') {
    errors.push('The type for at least one field was not a String.');
  }

  if (['String', 'Number', 'Date'].indexOf(field.type) === -1) {
    errors.push('At least one field had an unsupported type: ' + field.type + '.');
  }

  // we can't access any more properties because there were errors in the ones we need
  if (errors.length) {
    return errors;
  }

  if (field.type === 'Date' && !validator.isDate(field.val)) {
    errors.push('Custom Field "' + field.key + '" was not a valid Date.');
  } else if (field.type === 'Number' && (typeof field.val !== 'number' || isNaN(field.val))) {
    errors.push('Custom Field "' + field.key + '" was not a valid Number.');
  } else if (field.type === 'String' && typeof field.val !== 'string') {
    errors.push('Custom Field "' + field.key + '" was not a String.');
  }

  return errors;
}

export default validateField;

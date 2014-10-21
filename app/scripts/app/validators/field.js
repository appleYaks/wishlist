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

  // we can't access any more properties because there were errors in the ones we need
  if (errors.length) {
    return errors;
  }

  if (field.type === 'Date' && !validator.isDate(field.val)) {
    errors.push('Field "' + field.key + '" was a Date type but val was not a valid Date.');
  } else if (typeof field.val !== field.type.toLowerCase()) {
    errors.push('The val for field "' + field.key + '" was not of its given type, ' + field.type + '.');
  }

  return errors;
}

export default validateField;

import validateField from 'client/validators/field';

function validateGroup (group) {
  var title = Ember.get(group, 'title'),
      description = Ember.get(group, 'description'),
      fields = Ember.get(group, 'fields'),
      errors = [];

  if (typeof title !== 'string') {
    errors.push('Title field was not a String.');
  }

  if (typeof description !== 'string') {
    errors.push('Description field was not a String.');
  }

  if (!Array.isArray(fields)) {
    errors.push('Fields field was not an Array.');
  } else {
    fields.forEach(function (field) {
      errors = errors.concat(validateField(field));
    });
  }

  return errors;
}

export default validateGroup;

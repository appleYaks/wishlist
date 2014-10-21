import validateField from 'client/validators/field';

function validateItem (item) {
  var title = Ember.get(item, 'title'),
      description = Ember.get(item, 'description'),
      rating = Ember.get(item, 'rating'),
      priority = Ember.get(item, 'priority'),
      complete = Ember.get(item, 'complete'),
      fields = Ember.get(item, 'fields'),
      errors = [];

  if (typeof title !== 'string') {
    errors.push('Title field was not a String.');
  }

  if (typeof description !== 'string') {
    errors.push('Description field was not a String.');
  }

  if (typeof rating !== 'number') {
    errors.push('Rating field was not a Number.');
  }

  if (typeof priority !== 'number') {
    errors.push('Priority field was not a Number.');
  }

  if (typeof complete !== 'boolean') {
    errors.push('Complete field was not a Boolean.');
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

export default validateItem;

function numberizeField (field) {
  var val, newVal;

  if (Ember.get(field, 'type') !== 'Number') {
    return;
  }

  val = Ember.get(field, 'val');
  newVal = parseInt(val, 10);

  if (!isNaN(newVal)) {
    Ember.set(field, 'val', newVal);
  }
}

export default numberizeField;

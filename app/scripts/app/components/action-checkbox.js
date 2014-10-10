var ActionCheckbox = Ember.Checkbox.extend({
  transmitAction: function () {
    var action = this.get('action'),
        model = this.get('model');

    if (action && model) {
      this.get('controller').send(action, model);
    }
  }.observes('checked')
});

export default ActionCheckbox;

var ActionCheckbox = Ember.Checkbox.extend({
  transmitAction: function () {
    Ember.run.schedule('sync', this, function () {
      var action = this.get('action'),
      model = this.get('model');

      if (action && model) {
        this.get('controller').send(action, model);
      }
    });
  }.observes('checked')
});

export default ActionCheckbox;

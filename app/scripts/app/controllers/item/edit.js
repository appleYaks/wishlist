import ItemEditControllerMixin from 'client/mixins/item-edit-controller';

var ItemEditController = Em.ObjectController.extend(ItemEditControllerMixin, {
  complete: function (key, value) {
    if (arguments.length > 1) {
      return value;
    }

    return this.get('canonicalModel.complete');
  }.property('canonicalModel.complete'),

  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // call route.refresh(), which should tell `controllers.items` to slice out this model from its content
    },

    cancel: function () {
      this.get('model').destroy();
      this.transitionToRoute('items');
    },

    save: function () {

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
      } else if (fields.findBy('key', key)) {
        errors.push('Sorry, a field already exists with that name. Please try again.');
      }

      if (/[^a-zA-Z]/.test(key)) {
        errors.push('The name given needs to be composed of only letters.');
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

export default ItemEditController;

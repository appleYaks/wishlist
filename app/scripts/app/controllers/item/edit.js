var ItemEditController = Em.ObjectController.extend({
  complete: function () {
    var complete = this.get('canonicalModel.complete');

    if (complete) {
      return 'Yes';
    }

    return 'No';
  }.property('canonicalModel.complete'),

  actions: {
    deleteItem: function (item) {
      console.log('deleting item: ', item);
      // send API DELETE request with model's `id` and `GroupId`
      // tell `controllers.items` to slice out this model from its content
      // this.get('controllers.items');
    },

    cancel: function () {
    },

    save: function () {
      var model = this.get('model');
      var items = this.get('controllers.items.model');
      var blah = items.filter(function (item) {
        return item === model;
      });
      console.log(model);
      window.x = model;
      window.t = this;
      // console.log(items);
      // console.log(blah);
    }
  }
});

export default ItemEditController;

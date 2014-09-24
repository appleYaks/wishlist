var ItemEditRoute = Em.Route.extend({
  setupController: function (controller, item) {
    var tempItem = this.generateTempItem(item);
    tempItem = Ember.Object.create(tempItem);

    controller.set('model', tempItem);
    controller.set('canonicalModel', item);
  },

  // deep copy of passed-in model to mess with in case edits are canceled
  // seems like `.toJSON()` is not supported for `Ember.Object`
  generateTempItem: function (item) {
    return JSON.parse(JSON.stringify(item));
  },

  renderTemplate: function () {
    this.render('item/edit', {
      into: 'application',
      outlet: 'item',
    });
  }
});

export default ItemEditRoute;

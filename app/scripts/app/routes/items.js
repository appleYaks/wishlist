var ItemsRoute = Em.Route.extend({
  model: function (params) {
    // the JSON API should side-load the `items` relationships
    // http://emberjs.com/guides/models/the-rest-adapter/#toc_sideloaded-relationships
    //
    // this will never cause a load from server, since the 'groups' route is matched first,
    // populating the groups collection and forgoing the sideload of the associated `items`
    return this.store.find('group', params.group_id);
  },

  setupController: function (controller, model) {
    controller.set('model', model);

    // lazy-load the group's items if (or more accurately, since) they don't exist
    // http://emberjs.com/guides/models/the-rest-adapter/#toc_relationships
    //
    // this turns out to be unnecessary if {async: true} on the model
    // if (!model.get('items.length')) {
      // model.get('items');
    // }
  },

  renderTemplate: function () {
    this.render('items', {
      into: 'application',
      outlet: 'items',
    });
  }
});

export default ItemsRoute;

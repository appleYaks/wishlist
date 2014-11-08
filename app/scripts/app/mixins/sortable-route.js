var SortableRouteMixin = Ember.Mixin.create({
  clearSortingMethod: function (evt) {
    var controller;

    // depending on whether this was executed directly in JS,
    // through a template, or by a jQuery event handler,
    // we'll need to get the controller via the proper method.
    // a template may trigger the action for a controller/route pair that
    // is not the currently active route, in which case we prevent the action
    // from taking place on the active controller by passing a string
    // with the name of the controller to be changed.
    if (evt && evt.data && evt.data.controller) {
      controller = evt.data.controller;
    } else if (typeof evt === 'string') {
      controller = this.controllerFor(evt);
    } else {
      controller = evt || this.get('controller');
    }

    // the default from the data store is to sort id ascending.
    // if we set both to null, and the previous vals were to sort anything descending,
    // the list will be sorted by id, but in *descending* order.
    controller.set('sortProperties', ['id']);
    controller.set('sortAscending', true);
  },

  actions: {
    clearSort: function (controller) {
      this.clearSortingMethod(controller);
    },
  }
});

export default SortableRouteMixin;

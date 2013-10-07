define([
  'ember',
],

function (Em) {
  'use strict';

  var ItemRoute = Em.Route.extend({
    // model: function () {
    //   // bootstrap initialized data if it exists
    //   if (Em.isArray(window.bootstrap)) {
    //     this.store.pushMany('person', window.bootstrap);

    //     // signal to IndexController that data exists
    //     // and fetching from the server is not necessary
    //     // IndexRoute will remove this property after its first render.
    //     return Em.Object.create({
    //       bootstrapped: true,
    //     });
    //   }

    //   // signal to IndexController that data does not yet exist
    //   // and fetching from the server is necessary.
    //   // IndexRoute will remove this property after its first render.
    //   return Em.Object.create({
    //     bootstrapped: false
    //   });
    // },
    renderTemplate: function () {
      this.render('item', {
        into: 'application',
        outlet: 'item',
      });
    }
  });

  return ItemRoute;
});

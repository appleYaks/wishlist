define([
  'ember',
  'JST/index',
],

function (Em) {
  'use strict';

  var IndexRoute = Em.Route.extend({
    actions: {
      // error handler for when descendent
      // routes fail to resolve their model promises.
      // 'reason' is the value passed to the rejected promise.
      error: function (reason) {
        alert('Error transitioning to IndexRoute! The reason is: ' + reason);

        // you can try transitioning into another route.

        // descendent routes can implement this error handler too;
        // if it returns true, it'll bubble up to the parent's handler.
        // In this case, that's ApplicationRoute.
        // return true;
      },
    },

    redirect: function () {
      this.transitionTo('groups');
    },

    model: function () {

    },
  });

  return IndexRoute;
});

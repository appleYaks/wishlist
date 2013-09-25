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

    model: function () {
      var applicationModel = this.modelFor('application');

      if (applicationModel.get('bootstrapped') === true) {
        applicationModel.set('bootstrapped', null);
        return this.store.all('person');
      }

      return this.store.findAll('person').then(null, function () {
        // Promise rejected, the transition will be halted with an error
        // (which can optionally be handled with an 'error' function on 'actions'),
        // unless to 'recover', we fulfill with some default value to
        // use as the route's model and continue on with the transition
        return [
          Em.Object.create({
            name: 'Default',
            lowercaseName: 'default'
          })
        ];
      });
    },
  });

  return IndexRoute;
});

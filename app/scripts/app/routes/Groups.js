define([
  'ember',
],

function (Em) {
  'use strict';

  var GroupsRoute = Em.Route.extend({
    model: function () {
      var preload = this.get('preload');

      if (preload) {
        this.set('preload', null);
        return this.store.all('group');
      }

      return this.store.find('group');
    },

    renderTemplate: function () {
      this.render('groups', {
        into: 'application',
        outlet: 'groups',
      });
    }
  });

  return GroupsRoute;
});

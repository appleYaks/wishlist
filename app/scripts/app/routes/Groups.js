define([
  'ember',
],

function (Em) {
  'use strict';

  var GroupsRoute = Em.Route.extend({
    model: function () {
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

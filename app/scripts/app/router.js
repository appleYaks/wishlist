define([
  'ember',
],

function (Em) {
  'use strict';

  var Router = Em.Router.extend({
    location: 'history'
  });

  Router.map(function () {
    this.resource('groups', {path: '/groups'}, function () {
      this.resource('group', {path: ':group_id'}, function () {
        this.route('edit');
      });
      this.resource('items', {path: ':group_id/items'}, function () {
        this.resource('item', {path: ':group_id/items/:item_id'}, function () {
          this.route('edit');
        });
      });
    });
  });

  return Router;
});

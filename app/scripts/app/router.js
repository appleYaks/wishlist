define([
  'ember'
],

function (Em) {
  'use strict';

  var Router = Em.Router.extend({
    location: 'history'
  });

  Router.map(function () {
    this.route('index', {path: '/'});
    this.resource('scooby_card', {path: '/person/:name'});
  });

  return Router;
});

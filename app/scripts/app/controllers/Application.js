define([
  'ember'
],

function (Em) {
  'use strict';

  var ApplicationController = Em.Controller.extend({
    actions: {
      reloadPeople: function () {
        this.store.findAll('person');
      }
    }
  });

  return ApplicationController;
});

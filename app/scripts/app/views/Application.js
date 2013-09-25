define([
  'ember',
  'JST/application',
  'JST/application/_header',
  'JST/application/_footer',
],

function (Em) {
  'use strict';

  var ApplicationView = Em.View.extend({
    eventManager: {
      doubleClick: function (e, view) {
        console.log('*** ApplicationView Event: double-click event on view: ', view, ', Event: ', e);
      },
    },
  });

  return ApplicationView;
});

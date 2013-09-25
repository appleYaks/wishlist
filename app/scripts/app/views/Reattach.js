define([
  'ember',
  'JST/reattach',
],

function (Em) {
  'use strict';

  var ReattachView = Em.View.extend({
    templateName: 'reattach',
    classNames: ['reattach'],

    click: function (e) {
      var parentView = this.get('parentView');
      var visibleTimeout = 200;

      parentView.set('isVisible', false);
      console.log('Setting isVisible on parentView to true in ' + visibleTimeout + 'ms.');

      Ember.run.later(function () {
        parentView.set('isVisible', true);
      }, visibleTimeout);
    },

    didInsertElement: function () {
      var parentView = this.get('parentView');

      // i was trying to use this to change parentView on DOM insert, but:
      // pushObject is only available on ContainerViews...
      // other array-like methods are available on CollectionViews...
      // doesn't look like I can manually change parentViews on any other view type.
      // looks like i'll have to modify the model hierarchy directly and wait for the re-render.
      console.log('pushobject', this.pushObject);
    },

    parentViewDidChange: function () {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    },

    becameVisible: function () {
      console.log('ReattachView became visible! isVisible property:', this.get('isVisible'));
    },

    becameHidden: function () {
      console.log('ReattachView turned invisible! isVisible property:', this.get('isVisible'));
    },
  });

  return ReattachView;
});

define([
  'ember',
  'jquery',
  'JST/scooby_card',
],

function (Em, $) {
  'use strict';

  var ScoobyCardView = Em.View.extend({
    templateName: 'scooby_card',
    classNameBindings: ['test:testing:not-testing', 'anotherTest', 'thirdTest::3rdTestFalse'],
    test: false,
    anotherTest: true,
    thirdTest: false,

    attributeBindings: ['data-title', 'anotherAttr:data-another-attr'],
    'data-title': 'some title',
    anotherAttr: 'another attribute',

    /////////////////////
    // possible events //
    /////////////////////

    // Touch events:
    touchStart: function () {},
    touchMove: function () {},
    touchEnd: function () {},
    touchCancel: function () {},

    // HTML5 drag and drop events:
    dragStart: function () {},
    drag: function () {},
    dragEnter: function () {},
    dragLeave: function () {},
    drop: function () {},
    dragEnd: function () {},

    // Keyboard events:
    keyDown: function () {},
    keyUp: function () {},
    keyPress: function () {},

    // Mouse events:
    mouseDown: function () {},
    mouseUp: function () {},
    contextMenu: function () {},
    mouseMove: function () {},
    focusIn: function () {},
    focusOut: function () {},
    mouseEnter: function () {},
    mouseLeave: function () {},

    click: function (e) {
      window.y = this;
      var $card = this.$('.single.card');
      var controller = this.get('controller');

      // in a real situation you'd probably just want to use templates
      // and a controller to handle the click event.
      //
      // since this is just an example showing the use of a View,
      // this is needed otherwise the view itself will handle the click,
      // not desired because its a div spanning the width of the page.

      // if target is the card element or a descendent.
      if ($card[0] === e.target || $.contains($card[0], e.target)) {
        console.log('*** ScoobyCardView Event: Scooby card "' + controller.get('name') + '" clicked!');
      } else if (e.target === this.get('element')) {
        controller.send('isDirtyChecks');
      }
    },

    doubleClick: function (e) {
      // won't fire because ApplicationView has eventManager set for 'click' event
      alert('ScoobyCardView says: double-clicked!');
    },

    // Form events:
    // submit: function () {},
    // change: function () {},
    // focusIn: function () {}, // also applies to mouse event
    // focusOut: function () {}, // also applies to mouse event
    // input: function () {},


    ///////////////////////////////
    // possible hooks for a view //
    ///////////////////////////////

    // This hook is called after the view has been rendered but
    // before it has been inserted into the DOM. It does not
    // provide access to the view's element.
    willInsertElement: function () {},

    // This hook is called immediately after the view has been
    // inserted into the DOM. It provides access to the view's
    // `element` and is most useful for integration with an
    // external library. Any explicit DOM setup code should be
    // limited to this hook.
    didInsertElement: function () {
      // // for some reason this will block tests that include this view.
      // // depending on the delay, the test(s) may actually timeout.
      // Ember.run.later(this, function () {
      //   this.set('isVisible', false);
      // }, 500);

      // Ember.run.later(this, function () {
      //   this.set('isVisible', true);
      // }, 1200);
    },

    // This hook is called immediately before the element is
    // removed from the DOM. This is your opportunity to tear
    // down any external state associated with the DOM node.
    // Like `didInsertElement`, it is most useful for integration
    // with external libraries. Override this function to do
    // any teardown that requires an element, like removing event listeners.
    willDestroyElement: function () {},

    // Called when the view is about to rerender, but before
    // anything has been torn down. This is a good opportunity
    // to tear down any manual observers you have installed
    // based on the DOM state
    willClearRender: function () {},

    // This hook is called after a view's `isVisible` property,
    // or one of its ancestor's `isVisible` property, changes to
    // true and the associated element becomes visible. Note
    // that this hook is only reliable if all visibility is
    // routed through the `isVisible` property.
    //
    // If an ancestor's `isVisible` property changes to false,
    // all descendent views will be hidden (ancestor is display:none),
    // yet their `isVisible` properties will remain what they were before.
    becameVisible: function () {
      console.log('ScoobyCardView became visible! isVisible property:', this.get('isVisible'));
    },

    // This hook is called after a view's `isVisible` property,
    // or one of its ancestor's `isVisible` property, changes to
    // false and the associated element becomes hidden. Note
    // that this hook is only reliable if all visibility is
    // routed through the `isVisible` property.
    //
    // If an ancestor's `isVisible` property changes to false,
    // all descendent views will be hidden (ancestor is display:none),
    // yet their `isVisible` properties will remain what they were before.
    becameHidden: function () {
      console.log('ScoobyCardView turned invisible! isVisible property:', this.get('isVisible'));
    },

    // Called when the `parentView` property has changed.
    parentViewDidChange: function () {},
  });

  return ScoobyCardView;
});

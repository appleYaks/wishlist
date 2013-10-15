/*globals Ember,$,define*/
(function () {
  'use strict';

  var mixin = Ember.Mixin.create({
    // `element` and `view` are objects, and thus have
    // to be explicitly proxied to the underlying `content`
    // object, else they'll return null when `this.get` is called
    view: Ember.computed('content.view', function () {
      var view = this.get('content.view');

      if (typeof view === 'string') {
        view = this.get('parentController.container').lookup(['view', view].join(':'));
      }

      return view;
    }),

    // observes `content.element` and `view.element` to recompute
    element: Ember.computed('content.element', 'view', function () {
      var element = this.get('content.element') || this.get('view.element');

      if (typeof element === 'string') {
        element = $(element).eq(0);
      }

      if (element && !(element instanceof $)) {
        element = $(element).eq(0);
      }

      return element;
    }),

    finish: function () {
      var animationQ = this.get('parentController');

      console.log('type', this.get('type'));

      animationQ.removeObject(this);
    }
  });

  var transitionController = Ember.ObjectController.extend(mixin, {
    init: function () {
      this._super();

      // create transitionend handler, addClass to element
      // handler is invoked with context of view
      // after handler is called, call this.finish()
    }
  });

  var animationController = Ember.ObjectController.extend(mixin, {

  });

  var jqueryController = Ember.ObjectController.extend(mixin, {

  });

  var arrayController = Ember.ArrayController.extend({
    // the itemController looks up the controller with:
    // `container.lookup('controller:controllerType')`
    lookupItemController: function (object) {
      var type = object.type;
      var acceptedType = type === 'animation'  ? true :
                         type === 'transition' ? true :
                         type === 'jquery'     ? true :
                                                 false;

      Ember.assert('Animation type must be one of: "animation", "transition", or "jquery"!', acceptedType);

      if (type === 'transition') {
        return 'animationQ-css-transition';
      } else if (type === 'animation') {
        return 'animationQ-css-animation';
      } else if (type === 'jquery') {
        return 'animationQ-jquery';
      }
    },

    resolve: null,
    callbacks: Ember.A(),

    add: function (opts) {
      this.addObject(opts);
      return this;
    },

    then: function (fn) {

      return Ember.RSVP.Promise(function (resolve) {

      });
    }
  });

  Ember.Application.initializer({
    name: 'animationQ',
    // after: ['store'],

    initialize: function (container, application) {
      //////////////////////////////////////////////////////////
      // Method 1: Create isolated containers for controllers //
      //////////////////////////////////////////////////////////

      /*
       * further isolate the plugin by creating a container that
       * houses the created controllers. then only what's needed
       * for the application is finally injected.
       */

      /*
        create a new container to house controllers
        var Container = new Ember.Container();

        Container.register('controller:animationQObject', objController);
        Container.register('controller:animationQArray', arrayController);

        var controller = Container.lookup('controller:animationQArray');
        application.register('animationQ:main', controller, { instantiate: false });
        application.inject('controller', 'animationQ', 'animationQ:main');
      */

      //////////////////////////////////////////////////////
      // Method 2: Inject itemController into Application //
      //////////////////////////////////////////////////////

      /*
       * this code instead makes a tradeoff:
       * register an itemController on the user Application in order to not weigh
       * down the browser with extra containers that aren't used for anything else
       */

      // these controller registrations are needed in order for the itemController
      // and lookupItemController properties on the arrayController to work.
      application.register('controller:animationQ-css-transition', transitionController, { instantiate: false });
      application.register('controller:animationQ-css-animation', animationController, { instantiate: false });
      application.register('controller:animationQ-jquery', jqueryController, { instantiate: false });
      application.register('animationQ:main', arrayController);
      application.inject('route', 'animationQ', 'animationQ:main');
      application.inject('controller', 'animationQ', 'animationQ:main');
      application.inject('view', 'animationQ', 'animationQ:main');
    }
  });


  var AnimationQView = Ember.AnimationQView = Ember.View.extend({
    // classNames: ['specialview'],
    click: function (e) {
      console.log('check something son!!!!!')
      console.log('this super superrrr', this._super)
    }
  });

  var AnimationQLinkView = Ember.AnimationQLinkView = Ember.LinkView.extend({
    eventName: 'animationQ',

    animationQ: function () {
      // return this.get('parentView.blah');

      // needed since LinkViews seemingly don't inherit injected properties
      return this.nearestWithProperty('animationQ').get('animationQ');
    }.property('parentView'),

    click: function (e) {
      var evtName = this.get('eventName');

      console.log('view target: ', this.get('aQView'))
      console.log('element target: ', this.get('aQElement'))
      console.log('animation type: ', this.get('aQType'))
      console.log('animation className: ', this.get('aQClassName'))


      // transitionTo was already invoked by
      // this._invoke() if evtName == click
      if (evtName === 'click') return;

      e.preventDefault();
      // routeArgs seems to have format ['routeName', arguments for dynamic segements]
      // var rargs = this.get('routeArgs');
      // this.set('routeArgs', ['group', rargs[1]])
      // var args = [].slice.call(arguments);
      // this.trigger.apply(this, [evtName].concat(args));

      // if we use:
      var routeArgs = this.get('routeArgs');
      // this.get('controller').send('someAction', routeArgs);

      console.log('animationq', this.animationQ)
      console.log('animationq2', this.get('animationQ'))
      console.log('animationq3', this.animationQ)
      window.x = this;

      // the controller can do in its `someAction` handler:
      // `this.transitionToRoute.apply(this, routeArgs);`
    }
  });

  Ember.Handlebars.registerHelper('animationQ-link-to', function(name) {
    var options = [].slice.call(arguments, -1)[0],
        params = [].slice.call(arguments, 0, -1),
        hash = options.hash;

    hash.disabledBinding = hash.disabledWhen;
    hash.parameters = {
      context: this,
      options: options,
      params: params
    };

    return Ember.Handlebars.helpers.view.call(this, AnimationQLinkView, options);
  });

  Ember.Handlebars.registerHelper('animationQLinkTo', Ember.Handlebars.helpers['animationQ-link-to']);


  if (typeof define === 'function' && define.amd) {
    define(function () {
      return {
        AnimationQView: AnimationQView,
        AnimationQLinkView: AnimationQLinkView
      };
    });
  }
})();

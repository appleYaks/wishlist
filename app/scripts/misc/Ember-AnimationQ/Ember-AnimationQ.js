/*globals Ember,$,define*/
(function () {
  'use strict';

  /**
   * Mixin used for ObjectControllers
   */
  var mixin = Ember.Mixin.create({
    // `element` and `view` are objects, and thus have
    // to be explicitly proxied to the underlying `content`
    // object, else they'll return null when `this.get` is called
    view: Ember.computed(function () {
      var view = this.get('content.view');

      if (typeof view === 'string') {
        view = this.get('parentController.container').lookup(['view', view].join(':'));
      }

      return view;
    }).property('content.view'),

    // observes `content.element` and `view.element` to recompute
    element: Ember.computed(function () {


      return element;
    }).property('content.element', 'view'),

    finish: function () {
      var animationQ = this.get('parentController');

      console.log('type', this.get('type'));

      animationQ.removeObject(this);
    }
  });

  // var transitionController = Ember.ObjectController.extend(mixin, {

  // });

  // var animationController = Ember.ObjectController.extend(mixin, {

  // });

  // var jqueryController = Ember.ObjectController.extend(mixin, {

  // });

  var objectController = Ember.ObjectController.extend(mixin, {
    init: function () {
      this._super();

      var container = this.get('container');
      var controller = this.get('schema.controller');
      var element = this.get('schema.element');

      if (!element && typeof controller === 'string') {
        controller = ['controller', controller].join(':');
        this.set('schema.controller', container.lookup(controller));
      }


      // create transitionend handler, addClass to element
      // handler is invoked with context of view
      // after handler is called, call this.finish()
    }
  });

  var arrayController = Ember.ArrayController.extend({
    registeredTransition: null,
    animationCounter: 0,
    // animation types that views will trigger in their context
    schemas: Ember.A(),

    remainingAnimations: Ember.computed(function () {
      return this.filterBy('completed', false).get('length');
    }).property('@each.completed'),

    init: function () {
      this._super();

      // set `target` to the App.Router since it isn't done on App
      // initialization, as normally would happen with a controller
      this.set('target', this.get('container').lookup('router:main'));
    },

    itemController: 'animationQ',
    // -- OR --
    // the itemController looks up the controller with:
    // `container.lookup('controller:controllerType')`
    // lookupItemController: function (object) {
    //   var type = object.type;
    //   var controller = type === 'animation'  ? 'animationQ-css-animation'
    //                  : type === 'transition' ? 'animationQ-css-transition'
    //                  : type === 'jquery'     ? 'animationQ-jquery'
    //                  :                         false;

    //   Ember.assert('Animation type must be one of: "animation", "transition", or "jquery"!', controller);

    //   return controller;
    // },

    add: function (opts) {
      var validSchema = (opts.controller && Ember.ControllerMixin.detect(opts.controller)) || (opts.element && typeof opts.element === 'string');

      Ember.assert('Ember animationQ plugin requires options to have either an element selector or a target controller which includes Ember.ControllerMixin!', validSchema);
      if (!validSchema) return;

      opts.id = this.incrementProperty('animationCounter');

      if (opts.replaceClassesWith) {
        opts.addClasses = null;
        opts.removeClasses = null;
      }

      if (opts.element) {
        opts.controller = null;
        opts.namespace = null;
      } else {
        opts.namespace = opts.namespace || 'main';
      }

      this.addSchema(opts);

      return this;
    },

    addSchema: function (opts) {
      var schemas = this.get('schemas');

      schemas.push(opts);

      // fire the creation of animation objects right away
      // since there are no Views to notify
      if (opts.element) {
        var context = Ember.$(opts.element);

        // jquery animations are allowed on a collection.
        // CSS3 transition and animation event handlers
        // should only be attached to a single element.
        if (opts.type !== 'jquery') {
          context = context.eq(0);
        }

        this.start(opts.id, context);
      }
    },

    /**
     * Start applying animation schema to a view or element,
     * and firing any animation start callbacks.
     *
     * @method start
     * @api    private
     * @param  {Number} animationId The id of the animation schema in the schemas array.
     * @param  {View|String} context  The jQuery Element or View whose element will be modified.
     * @return {AnimationQ} this animationQ
     */
    start: function (schemaId, context) {
      var instance;
      var animationObject = this.findBy('context', context);

      var schema = this.get('schemas').findBy('id', schemaId);
      if (!schema) return;

      if (!animationObject) {

        if (typeof context === 'string' || context instanceof Ember.$) {
          type = 'element';
        } else if (Ember.View.detectInstance(context)) {
          type = 'view';
        }

        instance = {
          type: type,
          context: context,
          schema: schema
        };

        animationObject = this.addObject(instance) // will .one, .once, .trigger work for DOM events?
      }
    },

    completed: function (transition, model) {
      var that = this;

      return Ember.RSVP.Promise(function (resolve, reject) {
        that._registerTransition({
          resolve: resolve,
          reject: reject,
          transition: transition,
          model: model
        });
      });
    },

    _registerTransition: function (opts) {
      var previous = this.get('pendingTransition');

      if (previous && previous.transition) {
        previous.transition.abort();
      }

      this.set('pendingTransition', opts);
    },

    _resolveTransition: Ember.observer(function () {
      var remainingAnimations = this.get('remainingAnimations');

      if (remainingAnimations > 0) return;

      var pending = this.get('pendingTransition');

      if (pending && pending.transition && !pending.transition.isAborted) {
        pending.resolve(pending.transition, pending.model);
      }

      this.set('pendingTransition', null);

      // all animations have completed; current schemas no longer needed
      this.set('schemas', Ember.A());
    }, 'remainingAnimations')
  });

  Ember.Application.initializer({
    name: 'animationQ',
    // after: ['store'],

    initialize: function (container, application) {
      // these controller registrations are needed in order for the itemController
      // and lookupItemController properties on the arrayController to work.
      // application.register('controller:animationQ-css-transition', transitionController, { instantiate: false });
      // application.register('controller:animationQ-css-animation', animationController, { instantiate: false });
      // application.register('controller:animationQ-jquery', jqueryController, { instantiate: false });

      application.register('animationQ:main', arrayController);
      application.register('controller:animationQ', objectController, { instantiate: false });
      // application.register('animationQ:classes', Object, { singleton: false });

      application.inject('route', 'animationQ', 'animationQ:main');
      application.inject('controller', 'animationQ', 'animationQ:main');
      application.inject('view', 'animationQ', 'animationQ:main');
    }
  });
})();

(function () {
  'use strict';

  Ember.AnimationQView = Ember.View.extend({
    classNames: ['animationQ'],
    classNameBindings: ['animationQClasses'],
    animationQClassNamespace: 'main', // default
    init: function () {
      this._super();

      var namespace = this.get('animationQClassNamespace');
          namespace = namespace ? '.' + namespace : '';

      var fullPath = 'controller.animationQClasses' + namespace;

      this.addObserver(fullPath, function () {
        var schemaId = this.get(fullPath);
        var validAnimation = typeof schemaId === 'number';

        if (!validAnimation) return;

        this.get('animationQ').start(schemaId, this);
      });
    },
  });
})();

(function () {
  'use strict';

  Ember.AnimationQLinkView = Ember.LinkView.extend({
    eventName: 'animationQ',
    animationQFollowLink: true, // default

    click: function (event) {
      event.preventDefault();

      var evtName = this.get('eventName');

      // transitionTo was already invoked by
      // this._invoke() if evtName == click
      if (evtName === 'click') return;

      var action = this.get('action');
      var followedLink = this.get('followLink');
      var routeArgs = this.get('routeArgs');

      if (action) {
        this.get('controller').send(action, followedLink, routeArgs);
      }

      if (followedLink === true) {
        var args = [].slice.call(arguments);
        this.trigger.apply(this, [evtName].concat(args));
      }
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

    return Ember.Handlebars.helpers.view.call(this, Ember.AnimationQLinkView, options);
  });

  Ember.Handlebars.registerHelper('animationQLinkTo', Ember.Handlebars.helpers['animationQ-link-to']);
})();

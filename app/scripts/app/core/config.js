define([
  'json3',
  'ember',
],

function (JSON, Em) {
  'use strict';

  // create a hook for jQuery logic that will run after
  // a view and all child views have been rendered,
  // since didInsertElement runs only when the view's el
  // has rendered, and not necessarily all child views.
  // Note: if you use this hook, and also override didInsertElement,
  //       be sure to call this._super() in your overridden didInsertElement.
  //
  // http://mavilein.github.io/javascript/2013/08/01/Ember-JS-After-Render-Event/
  // http://emberjs.com/api/classes/Ember.run.html#method_next
  Em.View.reopen({
    didInsertElement : function(){
      this._super();
      Em.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent : function(){
      // implement this hook in your own subclasses and run your jQuery logic there
    }
  });

  // http://timkadlec.com/2013/01/windows-phone-8-and-device-width/
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    );
    document.getElementsByTagName('head')[0].appendChild(msViewportStyle);
  }

  return {};
});

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
  Em.View.reopen({
    didInsertElement : function(){
      this._super();
      Em.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent : function(){
      // implement this hook in your own subclasses and run your jQuery logic there
    }
  });

  return {};
});

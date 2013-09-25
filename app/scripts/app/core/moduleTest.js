define([
  'jquery',
],

function ($) {
  'use strict';

  // a function to illustrate how to test
  // the internals of RequireJS modules
  function internalFunction (data) {
    if (data) {
      return 1;
    } else {
      return 0;
    }
  }

  function asyncOperation (options) {
    var dfd = $.Deferred();

    setTimeout(function () {
      if (options && typeof options.success === 'function') {
        options.success();
      }

      dfd.resolve(42);
    }, 100);

    return dfd;
  }

  function init () {
    // do some setup work here

    return {
      asyncOperation: asyncOperation
    };
  }

  // expose anything you want to the test environment.
  // you can even choose to return the module's normal value by using `has` within a test suite.
  // this entire branch will be removed automatically during a production build.
  if (has('internalTest')) {
    return {
      init: init,
      asyncOperation: asyncOperation,
      internalFunction: internalFunction,
    };
  }

  // otherwise return the module's normal value
  return init;
});

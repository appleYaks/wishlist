var express     = require('express');
var serveStatic = require ('serve-static');
var app;

var init = function (appInstance) {
    app = appInstance;

    setupStatic();
};

var setupStatic = function () {
  // host dev files if in dev mode
  if (/^development|test$/.test(app.get('env'))) {
    app.use(serveStatic(app.root + '/.tmp'));
    app.use(serveStatic(app.root + '/app'));
  } else if (app.get('env') === 'production') {
    app.use(serveStatic(app.root + '/dist/app'));
  }
};

module.exports = {
    init: init,
};

var express = require('express');
var app;

var init = function (appInstance) {
    app = appInstance;

    setupStatic();
};

var setupStatic = function () {
  // host dev files if in dev mode
  if (/^development|test$/.test(app.get('env'))) {
    app.use(express.static(app.root + '/.tmp'));
    app.use(express.static(app.root + '/app'));
  } else if (app.get('env') === 'production') {
    app.use(express.static(app.root + '/dist/app'));
  }
};

module.exports = {
    init: init,
};

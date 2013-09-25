'use strict';

var v1 = exports.v1 = require('./v1');

// placeholder for app instance
var app;
exports.use = function (appInstance) {
  app = appInstance;

  v1.use(app);
};

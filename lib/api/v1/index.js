'use strict';

var groups = exports.groups = require('./groups');
var items = exports.items = require('./items');

// placeholder for app instance
var app;
exports.use = function (appInstance) {
  app = appInstance;

  groups.use(app);
  items.use(app);
};

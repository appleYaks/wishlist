'use strict';

var groups = require('./groups');
var items = require('./items');

exports.groups = groups;
exports.items = items;

exports.use = function (appInstance) {
  groups.use(appInstance);
  items.use(appInstance);
};

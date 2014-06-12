'use strict';

var groups = require('./groups');
var items = require('./items');

exports.groups = groups;
exports.items = items;

exports.init = function (appInstance) {
  groups.init(appInstance);
  items.use(appInstance);
};

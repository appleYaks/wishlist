var groups = require('./groups');
var items = require('./items');

exports.groups = groups;
exports.items = items;

exports.init = function (rawDB) {
  groups.init(rawDB);
  items.init(rawDB);
};

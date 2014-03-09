'use strict';

var mongoose = require('mongoose');
var connectOptions = {
  // db: { native_parser: true },
  // user: 'myUserName',
  // pass: 'myPassword',
  server: {
    auto_reconnect: true,
  },
};

connectOptions.server.socketOptions = { keepAlive: 1 };
exports.mainDB = mongoose.connect('mongodb://omelette/wishlist', connectOptions);


var groups = require('./groups');
var items = require('./items');

exports.groups = groups;
exports.items = items;

exports.use = function (appInstance) {
  groups.use(appInstance, mongoose);
  items.use(appInstance, mongoose);
};

// export the internal function only in a test environment
if (process.env.NODE_ENV === 'test') {
  // add more exports if needed
}

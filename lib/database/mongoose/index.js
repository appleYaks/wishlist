'use strict';

var secret = require('./db.secret.json');
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
mongoose.connect('mongodb://' + secret.host + '/wishlist', connectOptions);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('connected successfully');
});

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

'use strict';

var get = require('./get');
var post = require('./post');
var put = require('./put');
var del = require('./delete');

exports.get = get;
exports.post = post;
exports.put = put;
exports.delete = del;

exports.use = function (appInstance) {
  get.use(appInstance);
  post.use(appInstance);
  put.use(appInstance);
  del.use(appInstance);
};

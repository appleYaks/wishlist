'use strict';

var model = require('./model');
var Contextable = require ('../../../classes/Contextable');

var create = require('./create');
var read   = require('./read');
var update = require('./update');
var del = require('./delete');

var opts = {};
opts.create = create;
opts.read   = read;
opts.update = update;
opts.delete = del;

opts.use = function (appInstance, mongooseInstance) {
  this.app = appInstance;
  this.mongoose = mongooseInstance;
  this.sanitize = model.sanitize;
  this.schema = model.Schema(mongooseInstance);

  return this;
};

module.exports = Contextable.create(opts);

'use strict';

var create = exports;
var async = require('async');
var _ = require('lodash');

create.one = {};
create.many = {};

/*
 * Create functions (POST)
 */
create.one = function (obj, cb) {
  var model = new this.schema(obj);
  model.save(cb);
};

create.many = function (objs, cb) {
  var modelFns = objs.map(function (obj) {
    return this.create.one.bind(this, obj);
  }, this);

  async.parallel(modelFns, cb); // need to unzip [[], [], []] in cb
};


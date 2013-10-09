'use strict';

var read = exports;
var async = require('async');
var _ = require('lodash');

read.one = {};
read.many = {};

/*
 * Read functions (GET)
 */
read.all = function (cb) {
  this.schema
    .find()
    .sort('order')
    .exec(cb);
};

read.one.by = {
  id: function (id, cb) {
    this.schema
      .findById(id)
      .exec(cb);
  }
};

read.many.by = {
  id: function (ids, cb) {
    this.schema
      .find()
      .where('_id').in(ids)
      .exec(cb);
  }
};

'use strict';

var async = require('async');
var _ = require('lodash');
var libGroup = require('./model');
var inherits = require('util').inherits;
var Extendable = require ('../../../classes/Extendable');


var opts = {};
var create = opts.create = {};
var read   = opts.read   = {};
var update = opts.update = {};
var del    = opts.delete = {};

read.all = function (cb) {
  this.schema
    .find()
    .sort('order')
    .exec(cb);
};


var all = function (cb) {
  var allgroups = [
    {
      id: 0,
      name: 'group0',
      items: [0,1]
    },
    {
      id: 1,
      name: 'group1',
      items: [2,3]
    },
  ];

  cb(null, allgroups);
};

var getContextById = function (userId, contextId, cb) {
  Context
    .find({ userId: userId, _id: contextId })
    .sort('order')
    .exec(function (err, contexts) {
      if (_.isEmpty(contexts)) {
        cb(new Error('empty context set'));
        return;
      }

      if (contexts.length > 1) {
        cb(new Error('duplicate context ids'));
      }

      cb(err, contexts[0]);
    });
};

var getContextsByIds = function (userId, contextIds, cb) {
  Context
    .find({ userId: userId })
    .where('_id').in(contextIds)
    .sort('order')
    .exec(function (err, contexts) {
      if (_.isEmpty(contexts) && ! _.isEmpty(contextIds)) {
        cb(new Error('empty contexts set'));
        return;
      }

      cb(err, contexts);
    });
};

var getContexts = function (userId, cb) {
  if (_.isFunction(userId)) {
    cb = userId;
    return cb(new Error('no userId supplied'));
  }

  if (! _.isFunction(cb)) {
    throw new Error('callback not a function son!');
  }

  if (arguments.length !== 2 || ! _.isString(userId)) {
    return cb(new Error('arguments are jacked!'));
  }

  Context
    .find({ userId: userId })
    .sort('order')
    .exec(cb);
};

var postContext = function (contextObject, cb) {

};


function GroupInterface () {}
inherits(GroupInterface, Extendable);
// GroupInterface.prototype.extend = appInstance.classes.Extendable.prototype.extend;
GroupInterface.prototype.use = function (appInstance, mongooseInstance) {
  this.app = appInstance;
  this.mongoose = mongooseInstance;
  this.sanitize = libGroup.sanitize;
  this.schema = libGroup.Schema(mongooseInstance);
  this.extend(opts);

  return this;
};

module.exports = new GroupInterface();

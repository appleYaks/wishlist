'use strict';

var async = require('async');
var _ = require('lodash');
var libGroup = require('./model');
var inherits = require('util').inherits;
var Contextable = require ('../../../classes/Contextable');


var opts = {};
opts.use = function (appInstance, mongooseInstance) {
  this.app = appInstance;
  this.mongoose = mongooseInstance;
  this.sanitize = libGroup.sanitize;
  this.schema = libGroup.Schema(mongooseInstance);

  return this;
};

var create = opts.create = {};
var read   = opts.read   = { one: {}, many: {} };
var update = opts.update = { one: {}, many: {} };
var del    = opts.delete = { one: {}, many: {} };

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

  async.parallel(modelFns, cb);
};


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
  id: function () {

  }
};

read.many.by = {
  id: function () {

  }
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


module.exports = Contextable.create(opts);

'use strict';

var _ = require('lodash');
// var validator = require('validator');
// var ProjectValidator = require('../../../validators').project;
var scrub = require('../sanitize');

exports.sanitize = function (clientModel) {
  // clean a clientModel using a list of values the user cannot modify
  var invalidProps = [
    '__v',
    '_id',
    'id',
  ];

  clientModel = _.omit(clientModel, invalidProps);

  // do XSS rewriting
  scrub(clientModel);

  return clientModel;
};

exports.Schema = function (mongoose) {
  // index on { userId, order }
  //          { userId, title }
  //          { userId, desc }

  // fields { userId, root_groups [], order, title, desc }

  // create our schema
  var ItemSchema = mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    date: { type: Date, default: Date.now },
    priority: { type: Number, default: 0, min: 0 },
    complete: { type: Boolean, default: false },
    groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fields: [{ name: String, value: String }],
  });

  ItemSchema.set('toObject', {});
  ItemSchema.set('toJSON',
  {
    transform: function (doc, ret, options) {
      // remove sensitive/extra properties before packing it for Backbone
      // delete ret.userId;
      // delete ret.__v;

      // can also just return what I want
      return {
        id: ret._id,
        title: ret.title,
        rating: ret.rating,
        complete: ret.complete,
        group_id: ret.groupId,
        fields: ret.fields,
        // someProp: ret.title + ret.description,
      };
    },
  });

  return mongoose.model('Item', ItemSchema);
};

define([
  'ember',
  'ember-data'
],

function (Em, DS) {
  'use strict';

  var FieldsTransform = DS.FieldsTransform = DS.Transform.extend({
    serialize: function(value) {
      return value;
    },
    deserialize: function(value) {
      return Em.Object.create(value || {});
    }
  });

  Em.Application.initializer({
    name: 'fieldsTransform',

    initialize: function (container, application) {
      application.register('transform:fields', FieldsTransform);
    }
  });

  return FieldsTransform;
});

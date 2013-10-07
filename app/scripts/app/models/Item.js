define([
  'ember',
  'ember-data',
],

function (Em, DS) {
  'use strict';

  var attr = DS.attr;
  var belongsTo = DS.belongsTo;

  var Item = DS.Model.extend({
    name: attr('string'),
    group: belongsTo('group'),
    // lowercaseName: function () {
    //   return this.get('name').dasherize();
    // }.property('name'),

    // useful for the Ember Chrome extension
    // https://github.com/tildeio/ember-extension
    // http://emberjs.com/api/classes/Ember.Object.html#method_toString
    toStringExtension: function() {
      return this.get('name');
    }
  });

  return Item;
});

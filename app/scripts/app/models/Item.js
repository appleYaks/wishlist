define([
  'ember',
  'ember-data',
],

function (Em, DS) {
  'use strict';

  var attr = DS.attr;
  var belongsTo = DS.belongsTo;

  var Item = DS.Model.extend({
    title: attr('string'),
    rating: attr('number'),
    priority: attr('number'),
    complete: attr('boolean'),
    group: belongsTo('group'),
    fields: attr(),

    // lowercaseName: function () {
    //   return this.get('name').dasherize();
    // }.property('name'),

    // useful for the Ember Chrome extension
    // https://github.com/tildeio/ember-extension
    // http://emberjs.com/api/classes/Ember.Object.html#method_toString
    toStringExtension: function() {
      return this.get('title');
    }
  });

  return Item;
});

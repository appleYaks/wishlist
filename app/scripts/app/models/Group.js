define([
  'ember',
  'ember-data',
],

function (Em, DS) {
  'use strict';

  var attr = DS.attr;
  var hasMany = DS.hasMany;

  var Group = DS.Model.extend({
    title: attr('string'),
    order: attr('number'),
    date: attr('date'),
    items: hasMany('item', {async: true}),
    fields: attr(),

    // useful for the Ember Chrome extension
    // https://github.com/tildeio/ember-extension
    // http://emberjs.com/api/classes/Ember.Object.html#method_toString
    toStringExtension: function() {
      return this.get('title');
    }
  });

  return Group;
});
